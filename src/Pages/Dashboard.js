import React, { useEffect, useState } from "react";
import Headers from "../Components/Header";
import Cards from "../Components/Cards";
// import { Modal } from "antd";
import AddIncome from "../Components/Modals/AddIncome";
import AddExpense from "../Components/Modals/AddExpense";
import { addDoc, collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment/moment";
import TransactionTable from "../Components/TransactionTable";
import NoTransaction from "../Components/NoTransaction";
import Charts from "../Components/Charts";
import Reset from "../Components/Modals/Reset";

const Dashboard = () => {
  const [user] = useAuthState(auth);

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisble, setIsIncomeModalVisible] = useState(false);
  const [isResetModalVisible , setIsResetModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]); // to store the transaction doc
  const [income ,setIncome] = useState(0);
  const [expense , setExpense] = useState(0);
  const [totalBalance , setTotalBalance] = useState(0)
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const showResetModal = () => {
    setIsResetModalVisible(true)
  }

  const handleResetCancel = () => {
    setIsResetModalVisible(false)
  }

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  //  whenever the income or expesne is added the new data will be added

  const onFinish = (values, type) => {
    console.log(values)
    const newTransaction = {
      type: type,
      date:(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };  
    console.log(newTransaction)
        // if(type === "income"){  
        //   handleIncomeCancel() 
        // }  
        // else if(type == "expense"){
        //   handleExpenseCancel()
        // }

        // Passing the data to add the data in the users --> transaction --> files
        addTransaction(newTransaction);
  };

  //  function to add the data in the user collection inside the users/user.uid/transactions
  async function addTransaction(transaction , many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      ); 
      console.log("Documnet with id", docRef, docRef.id);
      if(!many) toast.success("Transaction Added!");

      // let newArr = transactions;
      // newArr.push(transaction);
      // setTransactions(newArr)
      await fetchTransaction()
      calculateBalance()

    } catch (e) {
      console.log("error", e);
      if(!many) toast.error("Couldn't add transaction");
    }
  }


  useEffect(() => {
    // Get all the doc from the collections
    fetchTransaction();
  }, [user]); 

  useEffect(() => {
      calculateBalance()
  } , [transactions])

  function calculateBalance(){
  
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach(transaction => {
      if(transaction.type === "income"){
        incomeTotal += transaction.amount  
      }else{
        expensesTotal += transaction.amount
      }
    })
    setIncome(incomeTotal)
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal-expensesTotal)
     
  }
  //  to fetch the data from the collections user in transactions
  
  async function fetchTransaction(param) {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots  && doc.data will gives us the data in the obj
        transactionsArray.push({...doc.data() , id : doc.id });
          console.log(doc.id);
      });
      setTransactions(transactionsArray);
      // console.log("transaction --- >" , transactionsArray);
      {

      (!param)   && toast.success("Transaction Fetched!");
      }
    }
    setLoading(false);
  }
  

  let sortedTransaction = transactions.sort((a, b) => {
    
   return new Date(a.date) - new Date(b.date);
    
});

  return (
    <div>
      <Headers />
      

      {loading ? (
        <>
          <p>Loading ....</p>
        </>
      ) : (
        <>
          <Cards
            income = {income}
            expense = {expense}
            totalBalance = {totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            showResetModal = {showResetModal}
          />
           {

              transactions.length != 0 ? <Charts  sortedTransaction = {sortedTransaction} /> : <NoTransaction />
           }
           
          <Reset 
          isResetModalVisible = {isResetModalVisible}
          handleResetCancel = {handleResetCancel}
          transactions = {transactions}
          fetchTransaction = {fetchTransaction}
         
          />


          <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncome
            isIncomeModalVisible={isIncomeModalVisble}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
        </>
      )}
      <TransactionTable transactions={transactions} addTransaction = {addTransaction} fetchTransaction = {fetchTransaction} />
    </div>
  );
};

export default Dashboard;
