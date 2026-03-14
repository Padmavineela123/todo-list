import { useState, useEffect } from "react";
import "./App.css";

export default function App() {

  const [tasks,setTasks] = useState([]);
  const [input,setInput] = useState("");
  const [filter,setFilter] = useState("all");

  const [time,setTime] = useState(25*60);
  const [running,setRunning] = useState(false);

  /* ---------------- TIMER ---------------- */

  useEffect(()=>{

    let interval;

    if(running){
      interval=setInterval(()=>{
        setTime(prev=>{
          if(prev<=1){
            clearInterval(interval);
            setRunning(false);
            return 25*60;
          }
          return prev-1;
        });
      },1000);
    }

    return ()=>clearInterval(interval);

  },[running]);

  function startTimer(){
    setRunning(true);
  }

  function resetTimer(){
    setRunning(false);
    setTime(25*60);
  }

  const minutes=Math.floor(time/60);
  const seconds=time%60;

  /* ---------------- PARSE TASK ---------------- */

  function parseTask(text){

    let priority="normal";
    let dueDate=null;

    const lower=text.toLowerCase();

    if(lower.includes("urgent")) priority="high";

    if(lower.includes("today")){
      dueDate=new Date().toISOString().split("T")[0];
    }

    if(lower.includes("tomorrow")){
      const d=new Date();
      d.setDate(d.getDate()+1);
      dueDate=d.toISOString().split("T")[0];
    }

    const clean=text
      .replace(/urgent|today|tomorrow/gi,"")
      .trim();

    return {text:clean,priority,dueDate};
  }

  /* ---------------- ADD TASK ---------------- */

  function addTask(){

    if(!input.trim()) return;

    const parsed=parseTask(input);

    const task={
      id:Date.now(),
      text:parsed.text,
      priority:parsed.priority,
      dueDate:parsed.dueDate,
      completed:false
    };

    setTasks([task,...tasks]);
    setInput("");
  }

  /* ---------------- TOGGLE TASK ---------------- */

  function toggleTask(id){

    setTasks(
      tasks.map(t =>
        t.id===id ? {...t,completed:!t.completed} : t
      )
    );
  }

  /* ---------------- DELETE TASK ---------------- */

  function deleteTask(id){
    setTasks(tasks.filter(task => task.id !== id));
  }

  /* ---------------- FILTER ---------------- */

  const today=new Date().toISOString().split("T")[0];

  const filteredTasks = tasks.filter(task=>{

    if(filter==="active") return !task.completed;

    if(filter==="completed") return task.completed;

    if(filter==="high") return task.priority==="high";

    if(filter==="today") return task.dueDate===today;

    return true;

  });

  /* ---------------- PROGRESS ---------------- */

  const completedTasks = tasks.filter(t=>t.completed).length;

  const progress =
    tasks.length===0
      ?0
      :Math.round((completedTasks/tasks.length)*100);

  const allCompleted =
    tasks.length>0 && completedTasks===tasks.length;

  /* ---------------- UI ---------------- */

  return(

    <div className="page">

      <div className="card">

        {/* HEADER */}

        <header className="header">

          <div>
            <h2>TaskMaster</h2>
            <span>{new Date().toDateString()}</span>
          </div>

          <div className="icons">
            <span>📊</span>
            <span>🔍</span>
            <span>🌙</span>
            <span>💾</span>
          </div>

        </header>

        {/* TIMER */}

        <div className="timer">

          <h1>
            {minutes}:{seconds.toString().padStart(2,"0")}
          </h1>

          <div>

            <button
              className={running ? "runningBtn" : ""}
              onClick={startTimer}
            >
              Start
            </button>

            <button onClick={resetTimer}>
              Reset
            </button>

          </div>

          <p>READY TO FOCUS</p>

        </div>

        {/* PROGRESS */}

        <div className="progressBox">

          <div className="progressHeader">
            <span>DAILY PROGRESS</span>
            <span>{progress}%</span>
          </div>

          <div className="progressBar">

            <div
              className="progressFill"
              style={{width:progress+"%"}}
            />

          </div>

        </div>

        {/* TASK INPUT */}

        <div className="taskInput">

          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder="Try: Buy milk tomorrow urgent"
          />

          <button onClick={addTask}>
            +
          </button>

        </div>

        {/* FILTERS */}

        <div className="filters">

          <span
            className={filter==="all"?"activeFilter":""}
            onClick={()=>setFilter("all")}
          >
            All
          </span>

          <span
            className={filter==="active"?"activeFilter":""}
            onClick={()=>setFilter("active")}
          >
            Active
          </span>

          <span
            className={filter==="completed"?"activeFilter":""}
            onClick={()=>setFilter("completed")}
          >
            Completed
          </span>

          <span
            className={filter==="high"?"activeFilter":""}
            onClick={()=>setFilter("high")}
          >
            🔥 High Priority
          </span>

          <span
            className={filter==="today"?"activeFilter":""}
            onClick={()=>setFilter("today")}
          >
            📅 Today
          </span>

        </div>

        {/* CONFETTI MESSAGE */}

        {allCompleted && (

          <div className="emptyState">

            <img
              src="https://cdn-icons-png.flaticon.com/512/742/742751.png"
              alt="confetti"
              width="80"
            />

            <p>All caught up! Time to relax.</p>

          </div>

        )}

        {/* TASK LIST */}

        <ul className="taskList">

          {filteredTasks.map(task=>(

            <li key={task.id}>

              <input
                type="checkbox"
                checked={task.completed}
                onChange={()=>toggleTask(task.id)}
              />

              <span
                style={{
                  textDecoration:
                    task.completed?"line-through":"none"
                }}
              >
                {task.text}
              </span>

              {task.priority==="high" && "🔥"}

              <button
                onClick={()=>deleteTask(task.id)}
                style={{marginLeft:"10px"}}
              >
                🗑
              </button>

            </li>

          ))}

        </ul>

      </div>

    </div>
  );
}
