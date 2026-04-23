import axios from "axios";
import { useEffect, useState } from "react";
import type { iTypes } from "./interfaces/iType";
import { useNavigate } from "react-router-dom";
import { useDelay } from "./hooks/useDelay";
export const API_URL = import.meta.env.VITE_API_URL;

export default function getResponseList() {


  // Навигация 
  const navigate = useNavigate();

  // АПИ Команды
  const apiCommands = {
    rooms: 'rooms',
    users: 'users',
  }

  // Обработчик ошибок
  const [error, setError] = useState<string | null>(null);

  // Внутренние UI state's
  const [inputRoomID, setinputRoomID] = useState("")
  const [userName, setUserName] = useState<iTypes['username']>("")
  const [copiedText, setCopiedText] = useState<string>('')
  const [getResponse, setGetResponse] = useState<iTypes[]>([]); // - мб удалить

  const [isGetLoading, setIsGetLoading] = useState(false)
  const [isPostLoading, setIsPostLoading] = useState(false)

  // Обработчик ошибок 
  const handleAxiosError = (err: any) => {
    if (err.response) {
      setError(`Ошибка ${err.response.status}: ${err.response.data.detail}`);
    } else if (err.request) {
      setError("Сервер не отвечает");
    } else {
      setError(`Ошибка: ${err.message}`);
    }
  };



  // <--------- Взаимодействие с API 
  const axiosGet = async (getData: string) => {
    if (isGetLoading) return
    setIsGetLoading(true)

    try {
      setError(null)
      const res = await axios.get(`${API_URL}/api/${getData}`)
      setGetResponse(res.data)
    } catch (err: any) {
      handleAxiosError(err)
    } finally {
      useDelay(5000, setIsGetLoading)
    }
  }

  const axiosPost = async (postData: string, dataToSend: iTypes) => {
    if (isPostLoading) return
    setIsPostLoading(true)
    try {
      setError(null)
      const res = await axios.post<iTypes>(`${API_URL}/api/${postData}`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      return res.data

    } catch (err: any) {
      console.log('ошибка')
      handleAxiosError(err)
      useDelay(5000, setIsPostLoading)
    }


  }
  // Взаимодействие с API --------->

  // <---------- Логика комнат 
  const createRoom = async () => {
    const res = await axiosPost(apiCommands.rooms, { username: userName });
    res?.room_id && await connectRoom(res.room_id);
  }

  const connectRoom = async (roomId: string) => {
    const res = await axiosPost(apiCommands.users, { username: userName, room_id: roomId });
    res?.user_id && res.room_id && navigate(`/room/${res.room_id}`, { state: res })
    console.log('connected')
  }
  // Логика комнат ----------->

  // <-------------- UI Взаимодействие
  useEffect(() => {

    const animateInterval = setTimeout(() => setCopiedText(''), 1000);
    return () => clearInterval(animateInterval)

  }, [copiedText])

  const copyRoomId = (copiedRoomId: string) => {
    navigator.clipboard.writeText(copiedRoomId)
    setCopiedText(copiedRoomId)
    setinputRoomID(copiedRoomId)
  }
  // UI Взаимодействие -------------->

  return (
    <>
      <div className="bunker-content">
        <div className="hero">
          <img src="/hero-img.png" alt="" className="hero__logo" />
          <div className="hero__connect">
            <p className="form-p">Ваш никнейм</p>
            <input
              type="text"
              value={userName}
              maxLength={15}
              onChange={(e) => {
                const filtered = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                setUserName(filtered)
              }}
              placeholder="Введите ваш никнейм"
              className="hero__input"
            />

            <p className="form-p">Код комнаты</p>
            <input
              placeholder="Введите код комнаты"
              value={inputRoomID}
              onChange={(e) => setinputRoomID(e.target.value)}
            />
            <button
            
              disabled={isPostLoading || (!userName || !inputRoomID) ? true : false}
              onClick={() => connectRoom(inputRoomID)}
            >

              Подключиться
            </button>

            <button 
            disabled={userName && !inputRoomID ? false : true} onClick={createRoom} >
              Создать комнату
            </button>

            <button
              disabled={isGetLoading ? true : false}
              onClick={() => (axiosGet(apiCommands.rooms))}>
              Получить список комнат
            </button>
            {getResponse.length > 0 ?
              <>
                <p>Открытых комнат: {getResponse.length}</p>
                <ul>
                  {getResponse.map((getRes: iTypes, i) => (
                    <li
                      key={i}>
                      <p
                        onClick={() => copyRoomId(getRes.room_id ?? '')}
                        className="room-id">
                        {getRes.room_id}
                      </p>
                      {copiedText.includes(getRes.room_id ?? '') && (
                        <p key={copiedText} className="copyText fadeIn"> Скопировано</p>
                      )}
                    </li>
                  ))}
                </ul>
              </>
              : ''
            }
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
        <div className="footer">
          <p className="footer-text">
            🄯 <b>Bunker</b> {new Date().getFullYear()} <b>Frontend by</b>  <a className="footer-link" href="https://github.com/urikrait"><span className="Urik">UrikRait</span></a> | <b>Backend by</b> <a className="footer-link" href="https://github.com/balybaleg"><span className="Balyba">Balybaleg</span></a><br />
            <a className="footer-link" href="about">О сайте</a>


          </p>
        </div>
      </div>
    </>
  );
}
