// src/components/InventoryManager.jsx
import React, { useReducer, useRef, useCallback } from 'react';

const initialState = { products: [] };

function reducer(state, action) {
    switch (action.type) {
        case 'add':
            return {
                products: [
                    ...state.products,
                    { id: Date.now(), name: action.name, quantity: 1 }
                ]
            };
        case 'increment':
            return {
                products: state.products.map(p =>
                    p.id === action.id ? { ...p, quantity: p.quantity + 1 } : p
                )
            };
        case 'decrement':
            return {
                products: state.products.map(p =>
                    p.id === action.id && p.quantity > 1
                        ? { ...p, quantity: p.quantity - 1 }
                        : p
                )
            };
        case 'remove':
            return { products: state.products.filter(p => p.id !== action.id) };
        default:
            return state;
    }
}

export default function InventoryManager() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const inputRef = useRef(null);

    const handleAdd = useCallback(() => {
        const name = inputRef.current.value.trim();
        if (!name) return;
        dispatch({ type: 'add', name });
        inputRef.current.value = '';
        inputRef.current.focus();
    }, []);

    const handleIncrement = useCallback(id => {
        dispatch({ type: 'increment', id });
    }, []);

    const handleDecrement = useCallback(id => {
        dispatch({ type: 'decrement', id });
    }, []);

    const handleRemove = useCallback(id => {
        dispatch({ type: 'remove', id });
    }, []);

    return (
        <div className="inventory">
            <h2>🛒 Gestor de Inventario</h2>
            <div className="add-row">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Nombre del producto"
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd}>Agregar</button>
            </div>

            <ul className="list">
                {state.products.map(p => (
                    <li key={p.id}>
                        <span>{p.name}</span>
                        <div className="actions">
                            <button onClick={() => handleDecrement(p.id)}>-</button>
                            <span>{p.quantity}</span>
                            <button onClick={() => handleIncrement(p.id)}>+</button>
                            <button className="remove" onClick={() => handleRemove(p.id)}>
                                ✖
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
