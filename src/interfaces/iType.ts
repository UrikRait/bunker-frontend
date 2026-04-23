export interface CardField {
    value: string;
    revealed: boolean;
}

export interface Card {
    advance?: CardField;
    bio?: CardField;
    health?: CardField;
    hobby?: CardField;
    inventory?: CardField;
    phobia?: CardField;
    profession?: CardField;

}
export interface iTypes {
    room_id?: string;
    name?: string;
    users?: string[];
    username?: string;
    is_ready?: boolean;
    alive?: boolean;
    card_id?: string;
    user_id?: string;
    type?: string;
    admin?: string;
    admin_info?: string;
    is_admin?: boolean;
    is_my_turn?:boolean;
    turn?: boolean;
    card_owner?: string;
    card?: Card;
    playerCardInfo?: {
        card?: Card;
    };

    websocket?: WebSocket;
}
