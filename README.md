#  Bunker 
Домен - https://urikrait.online/
Фронтенд часть игры **Bunker**, реализованная на стеке **React + TypeScript + Vite**.
Приложение взаимодействует с backend через **REST API (axios)** и **WebSocket** для real-time обновлений.

---

##  Основной функционал

### Лобби (создание и подключение)

* Создание комнаты
* Подключение к существующей комнате по ID
* Получение списка активных комнат
* Копирование ID комнаты в буфер обмена
* Валидация никнейма

### Работа с API

* `GET /api/rooms` — получить список комнат
* `POST /api/rooms` — создать комнату
* `POST /api/users` — подключиться к комнате

Обработка ошибок:

* Ошибки сервера (`response`)
* Нет ответа (`request`)
* Общие ошибки (`message`)

### WebSocket

* Подключение к комнате:

```
/api/wss/{room_id}/{user_id}/{username}
```

Поддерживаемые события:

* `get_users` — список игроков
* `get_admin` — текущий ведущий
* `update_player_card` — обновление карточек
* `game_started` — старт игры
* `ping/pong` — поддержание соединения
* `user_disconnected` — отключение игрока

---

##  Игровая логика

###  Игроки

* Отображение списка игроков
* Статусы:

  * Готов / Не готов
  * Жив / Мёртв
  * Текущий ход
* Сортировка по `user_id`

###  Карточки

Каждый игрок имеет характеристики:

* Био
* Профессия
* Хобби
* Здоровье
* Фобия
* Багаж
* Доп. характеристика

Логика:

* Свои характеристики видны полностью
* Чужие — скрыты до раскрытия

###  Ведущий (Admin)

Возможности:

* Назначить себя ведущим
* Начать игру (если все готовы)
* Управлять игрой:

  * Раскрыть характеристику (`reveal`)
  * Поменять роли (`swap`)
  * Убить игрока (`kill`)
  * Передать ход (`change_turn`)

---

##  Основные компоненты

### `getResponseList`

Отвечает за:

* Лобби
* Взаимодействие с REST API
* Создание/подключение к комнате
* UI формы

Ключевые состояния:

```ts
error: string | null
userName: string
inputRoomID: string
getResponse: iTypes[]
isGetLoading: boolean
isPostLoading: boolean
```

---

### `RoomTest`

Отвечает за:

* Игровую комнату
* WebSocket соединение
* Отрисовку игроков и карточек
* Логику ведущего

Ключевые состояния:

```ts
players: iTypes[]
cards: iTypes[]
gameStarted: boolean
playerAdmin: iTypes | undefined
wsError: string | null
```

---

##  Технологии

*  React
*  TypeScript
*  axios
*  WebSocket API
*  react-router-dom

---

##  Переменные окружения

Создайте `.env` файл:

```env
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
```


---

##  Авторы

* **Frontend:** https://github.com/urikrait
* **Backend:** https://github.com/balybaleg

---

