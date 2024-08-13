import axios from "axios";

const JOBS_API_BASE_URL = "http://localhost:8090/api/jobsList";

class JobsService {

    getJobsList(){
        return axios.get(JOBS_API_BASE_URL);
    }
}

export default new JobsService();