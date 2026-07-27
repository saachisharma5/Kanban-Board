let tasksData ={}
const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const columns =[todo, progress, done];
let dragElement = null;


function addTask(title,desc,column){
    const div = document.createElement("div")

    div.classList.add("task")
    div.setAttribute("draggable","true")

    div.innerHTML=`
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `
    column.appendChild(div)
    
    div.addEventListener("drag",(e)=>{
        dragElement = div;
    })
    const deleteButton = div.querySelector("button");
    deleteButton.addEventListener("click", ()=>{
        div.remove();
        updateTaskCount();
    })
    return div;
}
function updateTaskCount(){
    columns.forEach(col=>{
        const tasks = col.querySelectorAll(".task");
        const count=col.querySelector(".right");

        tasksData[col.id] =Array.from (tasks).map(t=>{
            return{
                title:t.querySelector("h2").innerText,
                desc:t.querySelector("p").innerText
            }
        })
        localStorage.setItem("tasks",JSON.stringify(tasksData));
        
        // const todoTasks=todo.querySelectorAll(".task");

        count.innerText = tasks.length;
    })
}
if(localStorage.getItem("tasks")){
    const data = JSON.parse(localStorage.getItem("tasks"));
    console.log(data)

    for(const col in data){
        const column = document.querySelector(`#${col}`);
    data[ col ].forEach(task => {
           addTask(task.title, task.desc,column); 
        })
        
    }
    updateTaskCount();
}

const tasks = document.querySelectorAll('.task');

tasks.forEach(task=>{
    task.addEventListener("dragstart", (e)=>{
        /*console.log("dragging", e);*/
        dragElement = task;
    })
})


/*progress.addEventListener("dragenter",(e)=>{
    progress.classList.add("hover-over");
})

progress.addEventListener("dragleave",(e)=>{
    progress.classList.remove("hover-over");
})*/
function addDragEventsOnColumn(column){
    column.addEventListener("dragenter",(e)=>{
        e.preventDefault();
    column.classList.add("hover-over");
})
column.addEventListener("dragleave",(e)=>{
    e.preventDefault();
    column.classList.remove("hover-over");
})

column.addEventListener("dragover",(e)=>{
    e.preventDefault();
})

column.addEventListener("drop",(e)=>{
    e.preventDefault();

    // console.log("Dropped",dragElement, column);
    column.appendChild(dragElement);
    column.classList.remove("hover-over");
    updateTaskCount();
    
})
}
addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

const toggleModalButton= document.querySelector("#toggle-modal")
const modalBg = document.querySelector(".modal .bg")
const modal = document.querySelector(".modal")
const addTaskButton= document.querySelector("#add-new-task")

toggleModalButton.addEventListener("click", ()=> {
    modal.classList.toggle("active")
})

modalBg.addEventListener("click", () => {
     modal.classList.remove("active")
})

addTaskButton.addEventListener("click", () => {
    const titleInput = document.querySelector('#task-title-input');
    const descInput = document.querySelector("#task-desc-input");

    const taskTitle = titleInput.value.trim();
    const taskDesc = descInput.value.trim();

    // ❌ validation added
    if (!taskTitle || !taskDesc) {
        titleInput.style.border = "1px solid red";
        descInput.style.border = "1px solid red";
        return;
    }

    // ✅ reset border if valid
    titleInput.style.border = "";
    descInput.style.border = "";

    addTask(taskTitle, taskDesc, todo);
    updateTaskCount();
    modal.classList.remove("active");

    // ✅ clear fields
    titleInput.value = "";
    descInput.value = "";
});