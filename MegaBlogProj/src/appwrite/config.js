import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query,  Permission, Role } from "appwrite";
import { Account } from "appwrite";


export class Service{
    client = new Client();
    databases;
    bucket;
    constructor(){
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases= new Databases(this.client);
        this.bucket= new Storage(this.client);
    }

    async createPost({title, slug, content, featuredImage, status, userId}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                },

               [
                Permission.read(Role.user(userId)),
                Permission.update(Role.user(userId)),
                Permission.delete(Role.user(userId))
               ]
            );
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            return null;
        }
    }

    async updatePost(slug, {title, content, featuredImage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
            )
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
            return false
        }
    }

    async getPosts(queries= [Query.equal("status", "active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            )
        } catch (error) {
             console.log("Appwrite service :: updatePost :: error", error);
             return false
        }
    }

    async getWelcomePost() {
        try {
            return await this.databases.getDocument(
               conf.appwriteDatabaseId,
               conf.appwriteWelcomeCollectionId, // ✅ Use welcome-post collection here
               conf.appwriteWelcomePostId
             );
        } catch (error) {
             console.log("Appwrite service :: getWelcomePost :: error", error);
             return null;
        }
    }
 

    //file upload services/method

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                [
                  Permission.read(Role.any()),  // 👈Make file publicly readable
                ]
            );
        } catch (error) {
             console.log("Appwrite service :: updatePost :: error", error);
             return false
        }
    }

    async deleteFile(fileId){
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
             console.log("Appwrite service :: updatePost :: error", error);
             return false;
        }
    }

   getFilePreview(fileId){
    return this.bucket.getFileView(
       conf.appwriteBucketId,
       fileId
    ).toString();
    }
}


const service=new Service()
export default service
