import React, { useEffect } from 'react';
import JobsService from '../service/JobsService';


const JobsListComponent = () => {

    const[jobs, setJobs] = React.useState([]);

    useEffect(() => {
        JobsService.getJobsList().then((res) => {
            setJobs(res.data);
        });
    }, []);
    return (
        <div>
            <table>
                <tbody>
                    {
                        jobs.map(
                            (job, index) =>
                                <tr key={job.job_id}>
                                    <td>{job.job_title}</td>
                                </tr>
                        )
                    }
                    <tr>
                        <td>test</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default JobsListComponent;