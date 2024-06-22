import React, { useEffect, useState } from "react";
import "./style.css";
import { Table, Select, Radio, Form, Input, DatePicker , Button,} from "antd";
import searchImg from "../../../src/assets/search.svg";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";
// import Button from "../Button";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "antd/es/form/Form";

const TransactionTable = ({ transactions ,addTransaction ,fetchTransaction }) => {
  // console.log(Select);
  const { Option } = Select;
  // console.log(Option);
 
  console.log(transactions)

  const [form] = Form.useForm()
  const [transactionId , setTransactionId] = useState("");
  const [type , setType] = useState()
  // const [isEdit ,  setIsEdit] = useState(false)

  const [user] = useAuthState(auth);
  
 

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text , record) => {
            if(transactionId === record.id){
          return (
              <Form.Item
                name="name"
                rules={[
                  {
                    required:true,
                    message:"Please Enter Your Name"
                  }
                ]}
              >
                 <Input type="text" className="custom-input" />
              </Form.Item>
              )
            }else{
              return<div>{text}</div>
            }
      }
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text , record) => {
        if(transactionId === record.id){
      return (
          <Form.Item
            name="amount"
            rules={[
              {
                required:true,
                message:"Please Enter Your Amount"
              }
            ]}
          >
                <Input type="number" className="custom-input" />
          </Form.Item>
          )
        }else{
          return <div>{text}</div>
        }
        }
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (text , record) => {
        if(transactionId === record.id){
      return (
          <Form.Item
            name="tag"
            rules={[
              {
                required:true,
                message:"Please Enter Your Tag"
              }
            ]}
          >{
           type === "income" ? 

                <Select className="select-input-2">
                  <Select.Option value="salary">Salary</Select.Option>
                  <Select.Option value="freelance">Freelance</Select.Option>
                  <Select.Option value="investment">Investment</Select.Option>
            {/* Add more tags here */}
               </Select>
          :
              <Select className="select-input-2" >
                  <Select.Option value="food">Food</Select.Option>
                  <Select.Option value="education">Education</Select.Option>
                  <Select.Option value="office">Office</Select.Option>
                  {/* Add more tags here */}
              </Select>
          }
          </Form.Item>
          )
        }else{
          return <div>{text}</div>
        }
        }
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text , record) => {
        if(transactionId === record.id){
      return (
          <Form.Item
            name="type"
            rules={[
              {
                required:true,
                message:"Please Enter Your Type"
              }
            ]}
            
          >
                <Select className="select-input-2" value={type} onChange={value => setType(value)}  >
                  <Select.Option value="income">Income</Select.Option>
                  <Select.Option value="education">Expense</Select.Option>
              {/* Add more tags here */}
            </Select>
          </Form.Item>
          )
        }else{
          return <div>{text}</div>
        }
        }
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text , record) => {
        if(transactionId === record.id){
      return (
          <Form.Item
            name="date"
            rules={[
              {
                required:true,
                message:"Please Enter Your Date"
              }
            ]}
          >
            <DatePicker className="custom-input" format="YYYY-MM-DD" style={{zIndex:"1000000" }} />
          </Form.Item>
          )
        }else{
          return <div>{text}</div>
        }
        }
    },
    {
      title:"Actions",
      render:( _ , record) => {
        return(
          <>
             {
              (transactionId !== record.id) ? <Button  
             
              onClick={e => {
                e.preventDefault()
               setTransactionId(record.id)
              //  setIsEdit(true)
              form.setFieldsValue({
                name:record.name,
                tag:record.tag,
                amount:record.amount,
                type:record.type
              });
              console.log(record)
              }}
              className="btn btn-blue" type="primary" htmlType="submit"
               >Edit </Button>:
              <Button  className="btn btn-blue" type="primary" htmlType="submit" >Save</Button>
               
             }

             <Button   
             onClick={() => deleteUser(record.id)}
             className="btn btn-blue" type="primary" htmlType="submit" 
              > Delete</Button>
          </>
        )
      }
    }
  ];

  let filteredTransaction = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  let sortedTransaction = filteredTransaction.sort((a, b) => {
    if (sortKey == "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

    // convert json to csv with the help of papaparse(npm package)

    function exportToCsv(){
      var csv = unparse({
        "fields": ["name" , "type" , "tag" , "date" , "amount"],
         data :  transactions
      });

      const blob = new Blob([csv] , {type: "text/csv;charset=utf-8;"});
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "transactions.csv";
      document.body.appendChild(link);
      link.click();
      document.body.appendChild(link);
    }


    function importFromCsv(event){
     event.preventDefault();
    console.log("first")
     try{
        parse(event.target.files[0] , {
          header:true,
          complete: async function (results) {
             for(const transaction of results.data){
              console.log(transaction)
              const newTransaction = {
                ...transaction,
                amount : parseFloat(transaction.amount),
              };
              await addTransaction(newTransaction , true)
             }
          },
        });
        toast.success("All Transaction Added")
       event.target.files = null;
       fetchTransaction()
     }
     catch(e){
        toast.error(e)
     }
    }


    const onFinish = (values,event) => {
      // event.preventDefault()
      console.log("first")
      console.log(values)
      const newTransaction = {
        type: values.type,
        date:(values.date).format("YYYY-MM-DD"),
        amount: parseFloat(values.amount),
        tag: values.tag,
        name: values.name,
      };  
      console.log(newTransaction)
      updateUser(newTransaction);
    }

    // function to update the specific doc in transaction collection 

    async function updateUser(transaction){
      const userDoc = doc(db , `users/${user.uid}/transactions` , transactionId)
        await updateDoc(userDoc , transaction);
         setTransactionId(null); 
        fetchTransaction();
        toast.success("Successfully Edited")

    }


    // function to delete a specific doc inside a transaction collection with a particular id
    async function deleteUser(id){
        const userDoc = doc(db , `users/${user.uid}/transactions` , id)
        console.log(userDoc)
       await deleteDoc(userDoc) 
       await fetchTransaction("done")
       toast.success("Deleted successfully")

    }
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          width:"90%", 
          margin: "0 auto 1rem",
        }}
      >
        <div className="input-flex">
          <img src={searchImg} width="16" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search By Name"
          />
        </div>

        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="my-table">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button
              className="btn"
              onClick={exportToCsv}
            >
              Export to CSV
            </button>
            <label for="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              onChange={importFromCsv}
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
        </div>
         
         <Form form={form} onFinish={(values , event) => onFinish(values , event )}>
        <Table 
        style={{boxShadow:"var(--shadow-color)" , width:"80%", margin:"auto" }}
        dataSource={sortedTransaction} 
        columns={columns}
        addTransaction ={addTransaction} 
        fetchTransaction={fetchTransaction}
        />
        </Form>
      </div>
    </div>
  );
};

export default TransactionTable;
