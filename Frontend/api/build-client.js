import axios from "axios";

// ! the baseurls must be updated for prod build

const BuildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server

    return axios.create({
      baseURL: `http://${process.env.BASEURL}`,
      headers: req.headers,
    });
  } else {
    // We must be on the browser

    return axios.create({
      baseURL: `http://${process.env.NEXT_PUBLIC_BASEURL}`,
    });
  }
};

export default BuildClient;
