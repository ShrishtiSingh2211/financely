import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, doc } from "../../firebase";
import { deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
const Reset = ({
  isResetModalVisible,
  handleResetCancel,
  transactions,
  fetchTransaction,
}) => {
  const [user] = useAuthState(auth);
  console.log(transactions);

  async function deleteUser() {
    if (transactions.length == 0) {
      toast.warn("You have no transaction to reset");
      handleResetCancel();
      return;
    } else {
      transactions.map(async (item) => {
        const userDoc = doc(db, `users/${user.uid}/transactions`, item.id);
        console.log(userDoc);
        await deleteDoc(userDoc);
      });
      console.log("first");
      handleResetCancel();
      fetchTransaction("success");
      toast.success("successfully done");
    }
  }

  return (
    <>
      <Modal
        open={isResetModalVisible}
        onOk={deleteUser}
        onCancel={handleResetCancel}
      >
        <h2 className="red">
          Are You sure you want to Reset all your transaction
        </h2>
      </Modal>
    </>
  );
};
export default Reset;
