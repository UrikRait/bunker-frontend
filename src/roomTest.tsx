import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import type { Card, iTypes } from "./interfaces/iType";
export const API_URL = import.meta.env.VITE_API_URL;
export const WS_URL = import.meta.env.VITE_WS_URL;

const RoomTest = () => {

  const [gameStarted, setGameStarted] = useState(false) // <--- Ждать реализации
  const [gameCanBeStarted, setGameCanBeStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [playerAdmin, setPlayerAdmin] = useState<iTypes>()
  const [wsError, setWsError] = useState<string | null>(null);

  const location = useLocation();
  const localUserData = location.state; // это твой res.localUserData

  console.log(localUserData)
  // WS логика

  const [players, setPlayers] = useState<iTypes[]>([])
  const [cards, setCards] = useState<iTypes[]>([])

  const [selectPlayer, setSelectPlayer] = useState('')
  const [selectPlayerStat, setSelectPlayerStat] = useState<keyof Card>()
  const [selectPlayerID, setSelectPlayerID] = useState('')

  const [selectPlayerTwo, setSelectPlayerTwo] = useState('')
  const [selectPlayerIDTwo, setSelectPlayerIDTwo] = useState('')

  const wsRef = useRef<WebSocket | null>(null);

  const sendJson = (data: object) => {
    wsRef.current?.send(JSON.stringify(data));
  }



  const playerReadyFunc = () => {
    setIsLoading(true)
    sendJson({ type: "ready" });

  }
  const setAdmin = () => {
    sendJson({ type: "set_admin" });
  }

  const startGame = () => {
    sendJson({ type: "start_game" })
  }

  const changeTurn = () => {
    sendJson({ type: "change_turn" })
  }

  const clearFields = () => {
    setSelectPlayer('')
    setSelectPlayerTwo('')
    setSelectPlayerStat(undefined)
  }

  const pong = () => {
    sendJson({
      type: "pong"
    })

  }
  const stats = [
    { key: 'bio', label: 'Био' },
    { key: 'profession', label: 'Профессия' },
    { key: 'hobby', label: 'Хобби' },
    { key: 'health', label: 'Здоровье' },
    { key: 'phobia', label: 'Фобия' },
    { key: 'inventory', label: 'Багаж' },
    { key: 'advance', label: 'Доп' },
  ];


  const adminAction = (newAction: string) => {
    sendJson({
      type: "admin_action",
      action: newAction,
      user_id: selectPlayerID,
      target_user_id: selectPlayerIDTwo,
      stat: selectPlayerStat
    })
    setSelectPlayer('')
    setSelectPlayerTwo('')
    setSelectPlayerStat(undefined)
    setSelectPlayerID('')
    setSelectPlayerIDTwo('')
  }



  const selectStat = (statKey: keyof Card, card?: Card, userId?: string, username?: string) => {
    const stat = card?.[statKey];
    if (!stat) return;


    setSelectPlayerStat(statKey);


    if (username) {
      if (!selectPlayer) {
        setSelectPlayer(username);
      } else if (!selectPlayerTwo) {
        setSelectPlayerTwo(username);
      } else {
        setSelectPlayer(selectPlayerTwo);
        setSelectPlayerTwo(username);
      }
    }

    // UserId
    if (userId) {
      if (!selectPlayerID) {
        setSelectPlayerID(userId);
      } else if (!selectPlayerIDTwo) {
        setSelectPlayerIDTwo(userId);
      } else {
        setSelectPlayerID(selectPlayerIDTwo);
        setSelectPlayerIDTwo(userId);
      }
    }


    console.log(stat, userId);
  };





  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/api/wss/${localUserData.room_id}/${localUserData.user_id}/${localUserData.username}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('WS подключен')
      sendJson({
        type: "get_users",
      });
      sendJson({ type: "get_admin" })

    }
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log(data.type)


      const userUpdate = () => {
        setPlayers(data.type.get_user_response)
      }

      if (data.type.get_user_response) {
        userUpdate()
      }
      if (data.type.user_disconnected) {
        userUpdate()
      }

      if (data.type.update_player_card) {
        setCards(data.type.update_player_card)

      }
      if (data.type.game_started) {
        setGameStarted(true)

      }
      if (data.type === "ping") {
        pong()
      }


    }
    ws.onerror = (event: Event) => {
      const err = event as ErrorEvent;
      console.error("Ошибка WebSocket:", err);
      setWsError(err.message || "Неизвестная ошибка WebSocket");
      console.log(wsError)
    }
    ws.onclose = () => {
      console.log("WS отключен")
    }



    return () => {
      ws.close()
    }

  }, [])

  useEffect(() => {
    const allReady = players.every(player => player.is_ready)
    setGameCanBeStarted(allReady)

    const admin = players?.find(player => player.is_admin);
    setPlayerAdmin(admin)

    const me = players.find(player => player.username === localUserData.username);
    if (me?.is_ready) {
      setIsLoading(false);
    }

  }, [players])

  const gameField =
    players
      ?.slice()
      .sort((a, b) => (a.user_id ?? '').localeCompare(b.user_id ?? ''))
      .map((player) => {
        const playerCardInfo = cards.find(playerCard => playerCard.card_owner === player.user_id);
        if (!gameStarted) {
          return (
            <div
              className={`bunker__body 
                ${player.is_admin ? "admin" : "player"}`}
              key={player.user_id}>
              <div
                className={`bunker__wrapper  
                  ${player.is_ready ? "ready" : ''} `}>
                <div className={`bunker__player`}>
                  <div
                    className={`player__state 
                     ${player.alive ? "live" : "dead"}`}>

                  </div>
                  {player.user_id === localUserData.user_id ?
                    <p
                      className={`player__name 
                        ${player.alive ? "live" : "dead"}`}>
                      <b>Вы</b>: <b style={{maxWidth:"100%"}}>{player.username}</b>
                    </p>
                    :
                    <p
                      className="player__name">Игрок:
                      <b style={{whiteSpace:"wrap"}}>{player.username}</b>
                    </p>}
                  <p
                    className="player__ready">

                    {player.user_id === localUserData.user_id ?
                      <>
                        Вы готовы?
                        <br />
                        <button
                          className={player.is_ready ? "ready" : ''}
                          onClick={playerReadyFunc}
                        >
                          {player.is_ready ? 'Готов ✅' : 'Не готов ❌'}
                        </button>
                      </> : ''}
                    {player.user_id !== localUserData.user_id ?
                      <>
                        {player.is_ready ?
                          'Готов ✅'
                          :
                          'Не готов ❌'}
                      </>
                      :
                      ''}
                  </p>

                </div>
              </div>
            </div>
          )
        }
        return (
          <div
            className={`bunker__body ${player.is_admin ? "admin" : "player"}`}
            key={player.user_id}>
            <div
              key={player.user_id}
              className={`bunker__wrapper 
              ${player.alive ? "live" : "dead"} 
              ${player.user_id === localUserData.user_id ? 'yourPlayer' : ''} 
              bunker__player 
              ${player.is_my_turn ? "turn" : ''} 
              ${player.is_ready ? "ready" : ''}`}
            >
              <div
                className={`bunker__player 
                ${player.is_admin ? "admin" : "player"} 
                `}
              >
                <div
                  className={`player__state 
                  ${player.is_my_turn ? "turn" : ''} 
                  ${player.alive ? "live" : "dead"}`}>
                </div>
                <ul className="player__stats">
                  {player.user_id === localUserData.user_id ?
                    <p
                      className={`player__name ${player.alive ? "live" : "dead"}`}>
                      <b>Вы</b>: <b>{player.username}</b>
                    </p>
                    :
                    <p
                      className={`player__name 
                      ${player.alive ? "live" : "dead"}`}>Игрок: <b>{player.username}</b>
                    </p>}
                  {player.user_id === localUserData.user_id ?
                    <>
                      {stats.map(stat => {
                        const cardKey = stat.key as keyof Card
                        const statData = playerCardInfo?.card?.[cardKey]
                        return (
                          <li
                            key={stat.key}
                            onClick={() => selectStat(stat.key as keyof Card, playerCardInfo?.card, player.user_id, player.username)}
                          >
                            <b>{stat.label}: </b>
                            <span
                              style={{ color: statData?.revealed ? 'green' : 'red' }}>
                              {statData?.value}
                            </span>

                          </li>
                        )
                      })}
                    </>
                    :
                    <>
                      {stats.map(stat => {
                        const cardKey = stat.key as keyof Card
                        const statData = playerCardInfo?.card?.[cardKey]
                        return (
                          <li
                            key={stat.key}
                            onClick={() => selectStat(stat.key as keyof Card, playerCardInfo?.card, player.user_id, player.username)}
                          >
                            <b>{stat.label}: </b>
                            <span
                              style={{ color: statData?.revealed ? 'black' : 'gray' }}>
                              {statData?.value} 
                            </span>

                          </li>
                        )
                      })}
                    </>
                  }
                </ul>
              </div>
            </div>
          </div>
        )

      })


  return (
    <>
      <h2
        className="bunker__room-id"
      >Номер комнаты :
        <span
          style={{ cursor: "pointer" }}
          onClick={() => navigator.clipboard.writeText(localUserData.room_id)}>{localUserData.room_id}
        </span>
      </h2>
      <div className="bunker">
        <div className="bunker__table">
          <div className="bunker__players">
            {gameField}
          </div>
          <div className="admin__panel">

            <div className="admin__panel-buttons">

              {playerAdmin?.user_id === localUserData.user_id && gameStarted ?
                <>
                  <h2>Панель ведущего</h2><br />
                  <p>Выбранный игрок : {selectPlayer}</p>
                  <p>Выбранный игрок  2: {selectPlayerTwo}</p><br />
                  <p>Выбранная роль : {selectPlayerStat}</p>

                  <button
                    disabled={!selectPlayer}
                    onClick={() => { clearFields() }}>Очистить</button><br /><br />

                  <button
                    disabled={!selectPlayer}
                    onClick={() => { adminAction('reveal') }}>Раскрыть харакетристику</button><br />

                  <button
                    disabled={!selectPlayer && !selectPlayerTwo}
                    onClick={() => { adminAction('swap') }}>Сменить роли</button><br />

                  <button
                    disabled={!selectPlayer}
                    onClick={() => { adminAction('kill') }}>Убить</button>

                  {playerAdmin?.user_id === localUserData.user_id && gameStarted ?
                    <button
                      onClick={() => (changeTurn())}
                    >Следующий ход
                    </button>
                    :
                    ""}
                </>
                :
                <>
                  {!playerAdmin && !isLoading ?
                    <button
                      onClick={setAdmin}
                    >Стать ведущим
                    </button>
                    :
                    ""}
                  {playerAdmin?.user_id === localUserData.user_id && !gameStarted && gameCanBeStarted ?
                    <button
                      onClick={() => (startGame())}
                    >Начать игру
                    </button>
                    :
                    ""}
                </>
              }
            </div>
          </div>
          <ul>
            {players?.map((player) => (
              <li
                key={player.user_id}
                style=
                {{
                  whiteSpace: "nowrap",
                  color:
                    playerAdmin?.user_id === player.user_id
                      ? '#980d0dff'
                      : player.user_id === localUserData.user_id
                        ? '#1beffeff'
                        : 'black',
                }}
              >
                {player.username}
                {player.user_id === localUserData.user_id ?  `${player.username} <-` : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default RoomTest;
