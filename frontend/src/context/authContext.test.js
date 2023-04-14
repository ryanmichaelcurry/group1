import { enableFetchMocks } from 'jest-fetch-mock'


const { renderHook, act } = require('@testing-library/react-hooks');
const { AuthProvider, AuthContext } = require('./AuthContext');
import secureLocalStorage from "react-secure-storage";
const React = require('react');
const { useContext } = require('react');





// borrowed structure from online
let mockStorage = {}

beforeAll(() => {
    global.Storage.prototype.setItem = jest.fn((key, value) => {
        mockStorage[key] = value
    })
    global.Storage.prototype.getItem = jest.fn((key) => mockStorage[key])
})

beforeEach(() => {
    // make sure the fridge starts out empty for each test
    mockStorage = {}
})

afterAll(() => {
    // return our mocks to their original values
    // THIS IS VERY IMPORTANT to avoid polluting future tests!
    global.Storage.prototype.setItem.mockReset()
    global.Storage.prototype.getItem.mockReset()
})










describe('AuthContext Testing: ', () => {

    ///////////////////////////////////////////////////////////////
    test('signIn function should set the userToken and user in the state',  () => {
        const payload = {
            email: "test@test.com",
            password: "test",
        };

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(payload),
        };
        act(() => {
            fetch("https://api.legalpaperweights.contrivesoftware.com/login", options)
                .then((result) => {
                    if (result.status != 200) {
                        throw new Error("Bad Response");
                        console.log("badresponse");
                    }
                    
                    
                })
                .then((data) => {
                    // Convert to an Object
                    console.log("here");
                    
                    console.log("LOGIN", data);

                    // SecureStore
                    //secureLocalStorage.setItem("accessToken", data.accessToken);
                    //secureLocalStorage.setItem("refreshToken", data.refreshToken);


                    console.log("xxxxx: ", secureLocalStorage);
                    expect(false).toBe(true);
                    expect(localStorage.getItem(jsonId)).toEqual(JSON.stringify(newJson));
                    expect(window.localStorage.accessToken).not.toBeNull();
                    expect(result.current.user).not.toBeNull();
                    
                })
                .catch((error) => {
                    console.log(error);
                    return error;
                    
                });
            
        });

        

        
    });

    //test('signOut function should remove user from local storage', async () => {


    //    const { result } = renderHook(() => useContext(AuthContext), {
    //        wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
    //    });

    //    await act(async () => {
    //        await result.current.signIn({ email: 'test@test.com', password: 'test' });
    //        console.log("result.current: ", result.current);

    //        console.log("result.current: ", result.current);
    //        console.log("session storage: ", sessionStorage);
    //        expect(result.current.userToken).not.toBeNull();
    //        expect(result.current.user).not.toBeNull();
    //    });
        
    });




    /////////////////////////////////////////////////




















//    test('singout testing', () => {
//        const { result } = renderHook(() => useContext(AuthContext), {
//            wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
//        });

//        return result.current.signIn({ email: 'test@test.com', password: 'test' }).then(data => {
//            expectconsole.log(data);
//            expect(true).toBe(true);
//        }
//        );
            
//    })
//})





//describe('signUp function', () => {
//    it('should fetch data from the server and store tokens in SecureStore', async () => {

        


//        const mockData = {
//            email: 'test@test.com',
//            password: 'test'
//        };

//        const mockResponse = {
//            status: 200,
//            text: () => Promise.resolve(JSON.stringify({
//                accessToken: 'some_access_token',
//                refreshToken: 'some_refresh_token'
//            }))
//        };

//        global.fetch = jest.fn().mockResolvedValue(mockResponse);

        

//        const { result, waitForNextUpdate } = renderHook(() => useContext(AuthContext), {
//            wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
//        });

//        await act(async () => {
//            await result.current.signIn({ email: 'test@test.com', password: 'test' });
//            await waitForNextUpdate();
//        });

//        console.log("Xkkf: ", secureLocalStorage.getItem("refreshToken"));

//        expect(fetch).toHaveBeenCalledTimes(2);

//        //expect(fetch).toHaveBeenCalledWith(
//        //    'https://api.legalpaperweights.contrivesoftware.com/refresh',
//        //    {
//        //        method: 'POST',
//        //        headers: {
//        //            'Content-Type': 'application/json'
//        //        },
//        //        body: JSON.stringify({
//        //            refreshToken: null,
//        //        })
//        //    },
//        //    'https://api.legalpaperweights.contrivesoftware.com/login',
//        //    {
//        //        method: 'POST',
//        //        headers: {
//        //            'Content-Type': 'application/json'
//        //        },
//        //        body: JSON.stringify({
//        //            refreshToken: null,
//        //        })
//        //    }
//        //);

//        expect(mockSecureLocalStorage.setItem).toHaveBeenCalledTimes(2);
//        expect(mockSecureLocalStorage.setItem).toHaveBeenNthCalledWith(
//            1,
//            'accessToken',
//            'some_access_token'
//        );
//        expect(mockSecureLocalStorage.setItem).toHaveBeenNthCalledWith(
//            2,
//            'refreshToken',
//            'some_refresh_token'
//        );

//        expect(mockDispatch).toHaveBeenCalledWith({
//            type: 'SIGN_IN',
//            token: 'some_access_token'
//        });
//    });

    
    

    
//});



