const form = document.querySelector("#new-task-form")
const input = document.querySelector("#new-task-input")
const list_el = document.querySelector("#tasks")
const submitButton = document.querySelector('#new-task-submit')

form.addEventListener("submit",(e)=>{
    e.preventDefault()
    const task = input.value;

    if (task === "") {
       { alert("Please enter task!")};
       return;
    }
    

    const taskInput = document.createElement("input");
    const actionDiv = document.createElement("div");
    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

   //  Edit and Delete Buttons
    editBtn.innerHTML = "Edit";
    deleteBtn.innerHTML = "Delete";
    actionDiv.classList.add("container");
    actionDiv.appendChild(editBtn);
    actionDiv.appendChild(deleteBtn);
    list_el.appendChild(actionDiv);
    
   //  taskInput
    list_el.appendChild(taskInput);
    taskInput.value = task;
    taskInput.setAttribute("readOnly", "readOnly");
    input.value = ""  

   // Editing and Removing Input
   editBtn.addEventListener("click", () => {
      if(editBtn.innerHTML.toLowerCase() === "edit") {
      
      // Change to Save mode
      taskInput.removeAttribute("readOnly");
      taskInput.focus();
      editBtn.innerHTML = "Save";
      } else {
         // Save the edited input
         taskInput.setAttribute("readOnly", "readOnly");
         editBtn.innerHTML = "Edit"
      }
   })

   // Saving the Edited Input


   deleteBtn.addEventListener("click", () => {
       list_el.removeChild(taskInput);
       actionDiv.removeChild(deleteBtn);
       actionDiv.removeChild(editBtn);
   });
});


