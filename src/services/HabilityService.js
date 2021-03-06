class HabilityService{

    axios
    apiUrl
    constructor(axios , apiUrl){
        this.axios = axios;
        this.apiUrl = `${apiUrl}api/habilities`
    }

    getAll(){
        return this.axios.get(`${this.apiUrl}`)
    }

    add(model){
        return this.axios.post(`${this.apiUrl}`,model)
    }

    remove(id){
        return this.axios.delete(`${this.apiUrl}/${id}`)
    }

    getById(id){
        return this.axios.get(`${this.apiUrl}/getbyid/${id}`)
    }

    edit(model){
        return this.axios.put(`${this.apiUrl}`,model)
    }
    
    getAllCategory(id){
        return this.axios.get(`${this.apiUrl}/getby/category/${id}`);
    }
}

export default HabilityService