import axios from "axios";
import { useEffect, useState, useRef } from "react";
import type { iTypes } from "./interfaces/iType";
export const API_URL = import.meta.env.VITE_API_URL;
export default function RoomsList() {

  const didMount = useRef(false);

  const [rooms, setRooms] = useState<iTypes[]>([]);
  const [refrashAxios, setRefrashAxios] = useState(Boolean)
  const [text, setText] = useState("")
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return;
    }

    const axiosData = async () => {
      try {
        const roomsRes = await axios.get(`${API_URL}/api/${text}`)
        setRooms(roomsRes.data)
      } catch (error) {
        console.error(error);
      }
    }
    axiosData()

  }, [refrashAxios, text])


  const handleClick = () => {
    setText(inputValue);
    setRefrashAxios(prev => !prev);
  };


  return (
    <>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleClick}>Отправить запрос</button>
      {rooms.length > 0 && rooms.map((room, i) => (
        <div key={i}>
          <pre>{JSON.stringify(room, null, 2)}</pre>
        </div>
      ))}
    </>
  );
}
