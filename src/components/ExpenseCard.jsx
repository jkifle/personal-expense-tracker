const ExpenseCard = ({ img, name, location, cost }) => {
  return (
    <div className="grid grid-cols-3 items-center">
      <img className="w-15" src={img} />
      <div>
        <h4 className="font-bold">{name}</h4>
        <p>{location}</p>
      </div>
      <p className="text-4xl justify-self-end">${cost}</p>
    </div>
  );
};

export default ExpenseCard;
