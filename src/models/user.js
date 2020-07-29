class User {

    constructor(props) {
        
        this.username = props.username;
        this.password = props.password;
        this.email = props.email;
        this.address = props.address;
        this.key = props.key;
        this.q = props.q;
        this.tx = props.tx;
    }
}

module.exports = User;