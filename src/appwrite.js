import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client() // Initialize the Appwrite client
  .setEndpoint("https://nyc.cloud.appwrite.io/v1") // Sets the Appwrite API endpoint (the URL where the Appwrite server is hosted)
  .setProject(PROJECT_ID); // Sets the project ID to identify which Appwrite project to use

const database = new Databases(client); // Initializes the Databases service to interact with the database, allowing to interact with Appwrite databases collections

// Summary: Function to update or create a document in the Appwrite database to track how many times a movie search term has been used
export const updateSearchCount = async (searchTerm, movie) => {
  // 1. Use Appwrite SDK to check if the search term exists in the database (This queries the Appwrite collection for documents where the searchTerm field matches the provided searchTerm)
  try {
    const result = await database.getDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);
    // 2. If the search term exists, update the count (If a document is found, it updates the count field by incrementing it by 1)
    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      // 3. If the search term doesn't exist (create a new document with the search term and count as 1, the ID of the movie, and the poster URL)
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
    // Error handling (If any error occurs during the process, log the error to the console)
  } catch (error) {
    console.error("Error checking search term:", error);
  }
};

// Summary: Function to get the top 5 trending movies based on search counts from the Appwrite database
// This queries the Appwrite collection, ordering documents by the count field in descending order and limiting the results to 5
export const getTrendingMovies = async () => {
  try {
    const result = await database.getDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return result.documents; // If successful, it returns the array of document objects (result.documents), each representing a trending movie
  } catch (error) {
    // If any error occurs during the fetch, log the error to the console
    console.error("Error fetching trending movies:", error);
  }
};
