import React from "react";
import Modal from "../Modal";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import useCreateMovie from "@/hooks/movie/useCreateMovie";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/globalContext";

function ModalMovies() {
        const { mutate: createMovie } = useCreateMovie();
        const { closeModal } = useGlobalContext(); // Access the closeModal function from the global context
        
        const router = useRouter();

        const [title, setTitle] = React.useState("");
        const [description, setDescription] = React.useState("");

        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();


          try {
            createMovie({ title, description } , {
              onSuccess: (movie) => {
                router.push(`/admin/movies/${movie.id}`);
                closeModal(); // Close the modal after successful creation
              },
            });
          } catch (error) {
            console.log("Error adding movie:", error);
          }  
        };

    return <Modal>
        <form action="" className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4">Add Movie</h1>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input 
          type="text" 
          id="title"  
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter movie title"
          className="border border-gray-300 rounded-md p-2" />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Input 
            type="text" 
            id="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter movie description"
            className="border border-gray-300 rounded-md p-2" />
        </div>

        <Button type="submit" variant={"brand-primary"} className="h-12">
          Add Movie
        </Button>
      </form>
    </Modal>;
}

export default ModalMovies;