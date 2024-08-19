import axios from "axios";

const serverURL = "http://localhost:8787/api/edoc/";

class EDocService{

    getEDocList() {
        return axios.get(serverURL + "eDocList");
    }
}

export default new EDocService();