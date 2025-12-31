import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const DisplayContent = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  return (
    <div>
      <h1>Saved Posts</h1>
      {posts.map((post) => (
        <div key={post.id} dangerouslySetInnerHTML={{ __html: post.content }} />
      ))}
    </div>
  );
};

export default DisplayContent;
