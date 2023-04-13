import React, { createContext, useContext, useEffect, useState } from "react";
const axios = require("axios");
import { AuthContext } from "../context/AuthContext";
import  secureLocalStorage  from  "react-secure-storage";

export const ApiContext = createContext();

const host = "https://api.legalpaperweights.contrivesoftware.com";

export const ApiProvider = ({ children }) => {
  const [connected, setConected] = useState(false);
  const [socket, setSocket] = useState(null);

  const { state, dispatch } = useContext(AuthContext);

  // For Generic HTTP requests
  async function send(source, body = {}, additionalHeaders = {}) {
    let method = source.split(":")[0];
    let endpoint = source.split(":")[1];
    let url = host + endpoint;

    const getRefreshToken = () => {
      let result = secureLocalStorage.getItem("refreshToken");
      if (result) {
        return result;
      }
      else {
        return "";
      }
    };

    let accessToken = state.userToken;

    try {
      let res = await axios({
        method: method,
        url: url,
        headers: {
          Authorization: "Bearer " + accessToken,
          ...additionalHeaders,
        },
        data: body,
      });

      return res.data;
    } catch {
      let refreshToken = secureLocalStorage.getItem("refreshToken");
      if(!refreshToken) refreshToken = "";
      try {
        let newAccessToken = await axios({
          method: "post",
          url: host + "refresh",
          headers: {
            Authorization: "Bearer " + accessToken,
            ...additionalHeaders,
          },
          data: { "refreshToken": refreshToken },
        });

        await secureLocalStorage.setItem(
          "accessToken",
          newAccessToken.data.accessToken
        );
        dispatch({
          type: "RESTORE_TOKEN",
          token: newAccessToken.data.accessToken,
          account: state.userAccount,
        });

        let res = await axios({
          method: method,
          url: url,
          headers: {
            Authorization: "Bearer " + newAccessToken.data.accessToken,
            ...additionalHeaders,
          },
          data: body,
        });

        return res.data;
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <ApiContext.Provider value={{ send, socket, connected }}>
      {children}
    </ApiContext.Provider>
  );
};
