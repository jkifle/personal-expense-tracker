import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../contexts/authContexts";
import { VscChromeClose } from "react-icons/vsc";

const ExpenseCard = ({
  docId,
  img,
  name,
  category,
  amount,
  date,
  onDelete,
}) => {
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
        <div className="flex columns-2 gap-3">
          <p>{category}</p>
          <p className=" justify-self-end">{date}</p>
        </div>
      </div>

      <p className="text-4xl justify-self-end">${amount}</p>
      <button
        className="justify-self-end mr-2 border p-2 bg-red-400 rounded-lg"
        onClick={deleteExpense}
      >
        <VscChromeClose />
      </button>
    </div>
  );
};

export default ExpenseCard;
