import './App.css';
import { useState, useEffect } from 'react'

function App() {
    const [message, setMessage] = useState('');
    useEffect(() => {
        fetch('/api/test')
            .then((res) => res.json())
            .then((data) => setMessage(data.test));
    }, [])
    return (
        <div className="App">
            <h1>App</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;