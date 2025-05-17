import {useEffect, useState} from "react";
import axios from "axios";

const App = () => {
    const [tables, setTables] = useState([]);

    useEffect(() => {
        axios.get('/api/tables').then(({data}) => setTables(data))
    }, [])
    return (
        <div>
            <div>Tables</div>
            {tables.map(table => <div key={table.id}>{JSON.stringify(table)}</div>)}
        </div>
    );
};

export {App};