import { useState, useEffect } from "react";
import "./App.css";

function App() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState([]);

  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const getNotes = async () => {
    try {
      const response = await fetch("https://notesaver-csma-vaishu-1.onrender.com/notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.log(error);
    }
  };
  const saveNote = async () => {
    if (title === "" || description === "") {
      alert("Please Fill All Fields");
      return;
    }
    try {
      const response = await fetch("https://notesaver-csma-vaishu-1.onrender.com/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description
        })
      });
      if (response.ok) {
        alert("Note Saved Successfully");
        setTitle("");
        setDescription("");
        getNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const editNote = (note) => {
    setTitle(note.title);
    setDescription(note.description);
    setEditId(note._id);
    setIsEditing(true);
  };
  const updateNote = async () => {
    if (title === "" || description === "") {
      alert("Please Fill All Fields");
      return;
    }
    try 
    {
      const response = await fetch(
        `https://notesaver-csma-vaishu-1.onrender.com/notes/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title,
            description
          })
        }
      );
      if (response.ok) {
        alert("Note Updated Successfully");
        setTitle("");
        setDescription("");
        setEditId(null);
        setIsEditing(false);
        getNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const deleteNote = async (id) => {
    try {
      const response = await fetch(
        'https://notesaver-csma-vaishu-1.onrender.com/notes/${id}`,
        {
          method: "DELETE"
        }
      );
      if (response.ok) {
        alert("Note Deleted Successfully");
        getNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getNotes();
  }, []);
  return (
    <div className="container">
      <div className="note-box">
        <h1>📝 Notes Saver</h1>
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button onClick={isEditing ? updateNote : saveNote}>
          {isEditing ? "Update Note" : "Save Note"}
        </button>
      </div>
      <div className="notes-list">
        <input
          type="text"
          placeholder="Search Notes..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <h2>Saved Notes</h2>
        {
          notes
            .filter(
              (note) =>
                note.title
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                note.description
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )
            .map((note) => (
              <div className="note-card" key={note._id}>
                <h3>{note.title}</h3>
                <p>{note.description}</p>
                <button onClick={() => editNote(note)}>
                  Edit
                </button>
                <button onClick={() => deleteNote(note._id)}>
                  Delete
                </button>
              </div>
            ))
        }
      </div>
    </div>
  );
}
export default App;
