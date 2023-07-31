import React from 'react';
import { useLocation } from 'react-router-dom';

const QuizGame = () => {
    const location = useLocation();
    const { state } = location;

    return (
        <div>
            {console.log(state?.message,"data>>>>>>>>>>>>>>>>")}
            <h1>Page Two</h1>
            {state && <p>GameId: {state.message.game_Id}</p>}
            {state && <p>UserId: {state.message.userId}</p>}
        </div>
    );
};

export default QuizGame;
