import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config"
import { Container, PostCard } from '../components'
import authService from "../appwrite/auth";
import { Query } from 'appwrite';

function Home() {
    const [posts, setPosts] = useState([]);
    const [welcomePost, setWelcomePost] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //      // Fetch welcome post
    //     appwriteService.getWelcomePost().then((post) => {
    //         if (post) setWelcomePost(post);
    //     });
    //      // Fetch all other posts
    //     appwriteService.getPosts([]).then((posts) =>{
    //       if(posts){
    //         // Filter out welcome post from posts
    //           const filtered = welcomePost 
    //                 ? posts.documents.filter(p => p.$id !== welcomePost .$id)
    //                 : posts.documents;
    //           setPosts(filteredPosts)
    //       }
    //       setLoading(false);
    //    } );
    // }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await authService.getCurrentUser(); // ✅ Fix
                if (!user) {
                    setLoading(false);
                    return;
                }
    
                const welcome = await appwriteService.getWelcomePost();
                setWelcomePost(welcome);

                const allPosts = await appwriteService.getPosts([
                    Query.equal("status", "active"),
                    Query.equal("userId", user.$id),  // ✅ filter user-specific posts
                ]);

                if (allPosts) {
                    // Remove the welcome post from allPosts
                    const filteredPosts = welcome
                        ? allPosts.documents.filter(p => p.$id !== welcome.$id)
                        : allPosts.documents;

                    setPosts(filteredPosts);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    if (loading) {
        return (
            <div className="text-center py-8">Loading posts...</div>
        );
    }

    if(posts.length === 0){
        return(
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
   return (
      <div className="w-full py-8">
         <Container>
           <div className="flex flex-wrap">
        
               {/* Fixed welcome post on the left side */}
               {welcomePost && (
                 <div className="p-2 w-full sm:w-1/4">
                   <PostCard {...welcomePost} />
                 </div>
               )}
       
               {/* User posts on the right (take up remaining space) */}
               <div className="p-2 w-full sm:w-3/4 flex flex-wrap">
                 {posts.map((post) => (
                   <div key={post.$id} className="p-2 w-full md:w-1/2 lg:w-1/2 xl:w-1/3">
                     <PostCard {...post} />
                   </div>
                 ))}
             </div>

           </div>
         </Container>
      </div>
    );

}

export default Home