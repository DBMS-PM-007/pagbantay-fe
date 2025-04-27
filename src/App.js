import { jsx as _jsx } from "react/jsx-runtime";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_BASE_URL);
function App() {
    return (_jsx("div", { className: "flex h-screen justify-center items-center bg-gray-100", children: _jsx("p", { className: "text-4xl font-bold text-blue-600", children: "Tailwind is working! \uD83C\uDF89" }) }));
}
export default App;
