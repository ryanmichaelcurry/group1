import React,  { createContext, Component } from 'react';

export const UserContext = createContext();

class UserContextProvider extends Component {
    state = {
        user_id: 'defaultUserName',
        first: "John",
        last: 'Doe',
        status: 'buyer'
    }
    login = (userId, First, Last, Status) => {
        this.user_id = userId;
        this.first = First;
        this.last = Last;
        this.status = Status;
    }
    logout = () => {
        this.user_id = 'defaultUserName';
        this.first = "John";
        this.last = 'Doe';
        this.status = 'buyer';
            
	}
    render() {
        return ( 
            <UserContext.Provider value={{ ...this.state, login: this.login, logout: this.logout }}>
                {this.props.children}
            </UserContext.Provider>
        );
	}
}

export default UserContextProvider;

//export const UserProvider = ({ children }) => {
//    const [user, setUser] = useState(null);

//    const login = (userData) => {
//        setUser(userData);
//    };

//    const logout = () => {
//        setUser(null);
//    };

//    return (
//        <UserContext.Provider value={{ user, login, logout }}>
//            {children}
//        </UserContext.Provider>
//    );
//};