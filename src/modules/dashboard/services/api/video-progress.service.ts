// src/services/video-progress.service.ts
import axios from 'axios';

class VideoProgressService {
    private baseURL = `${process.env.REACT_APP_API_URL || ''}/api/video-progress`;

    async getLessonViewers(lessonId: string) {
        const token = localStorage.getItem('token');
        return axios.get(`${this.baseURL}/lessons/${lessonId}/viewers`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async getLessonStats(lessonId: string) {
        const token = localStorage.getItem('token');
        return axios.get(`${this.baseURL}/lessons/${lessonId}/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }

    async updateVideoProgress(data: {
        lessonId: string;
        videoUrl: string;
        currentTime: number;
        duration: number;
    }) {
        const token = localStorage.getItem('token');
        return axios.post(this.baseURL, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }
}

export default new VideoProgressService();