import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/authContexts";

const ExpenseCard = ({ img, name, location, cost, docId, onDelete }) => {
  const { currentUser } = useAuth();
  const uid = currentUser.uid;

  const deleteExpense = async () => {
    const docRef = doc(db, "userPortfolios", uid, "Expenses", docId);
    try {
      await deleteDoc(docRef);
      console.log("Document successfully deleted!");
      onDelete?.(); // Optional: parent callback to update UI
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div className="grid grid-cols-4 items-center">
      <img className="w-15" src={img} />
      <div>
        <h4 className="font-bold">{name}</h4>
        <p>{location}</p>
      </div>
      <p className="text-4xl justify-self-end">${cost}</p>
      <button
        className="justify-self-end mr-2 border p-2 bg-red-400 rounded-lg"
        onClick={deleteExpense}
      >
        Delete
      </button>
    </div>
  );
};

export default ExpenseCard;
