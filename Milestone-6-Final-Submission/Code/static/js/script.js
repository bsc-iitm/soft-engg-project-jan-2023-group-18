const host = 'http://127.0.0.1:5000/'

const Home = { 
  data() {
    return {
      email:null,
      password:null,
      error:null,
    }
  },
  methods: {
    validate() {
      pattern = /^[\w-\.]+@[\w-\.]*(iitm.ac.in)$/
      if(!this.email.match(pattern)) {
        this.error="Invalid E-Mail ID"
      }
      else {
        fetch(host + '/', {
          method: "POST",
          headers: { "Content-Type":"application/json", },
          body: JSON.stringify({email:this.email,password:this.password}),
        })
        .then((res) => {
          if(res.status == 404) {
            this.error="User Not Registered"
          }
          else if(res.status == 400) {
            this.error="Incorrect Password"
          }
          else if(res.status == 200) {
            this.$router.push({
              path: `/${this.email}`
            })
          }
        })
        .catch(error => { console.log(error) })
      }
    }
  },
  template: `
    <form @submit.prevent="validate">
      <center>
        <br>
        <h2> LogIn to Continue </h2>
        <br>
        <div>
          <label> E-Mail ID: &nbsp;</label>
          <input type="email" placeholder="E-Mail ID" v-model="email" autocomplete="on" autofocus required>
        </div>
        <br>
        <div>
          <label> Password: &nbsp;</label>
          <input type="password" placeholder="Password" v-model="password" autocomplete="on" autofocus required>
        </div>
        <br>
        <button type="submit" class="btn btn-outline-primary"> LogIn </button>
        <br>
      </center>
    </form>
    <center><h3> Not Registered? <router-link to="/register"> Register </router-link></h3></center>
    <center v-if="error" class="alert alert-warning" role="alert">
      <p>{{error}}</p>
    </center>
  ` 
}

const Register = { 
  data() {
    return {
      email:null,
      password:null,
      cnf_pass:null,
      role:null,
      error:null,
    }
  },
  methods: {
    validate() {
      pattern = /^[\w-\.]+@[\w-\.]*(iitm.ac.in)$/
      if(!this.email.match(pattern)) {
        this.error="Invalid E-Mail ID"
      }
      else if(this.password!=this.cnf_pass) { 
          this.error="Password Mismatch"
      }
      else {
        fetch(host + '/', {
          method: "POST",
          headers: { "Content-Type":"application/json", },
          body: JSON.stringify({email:this.email,password:this.password,role:this.role}),
        })
        .then((res) => {
          if(res.status == 400) {
            this.error="User Already Registered"
          }
          else if(res.status == 200) {
            this.$router.push({
              path: `/${this.email}`
            })
          }
        })
        .catch(error => { console.log(error) })
      }
    }
  },
  template: `
    <form @submit.prevent="validate">
      <center>
        <br>
        <h2> Register Yourself </h2>
        <br>
        <div>
          <label> E-Mail ID: &nbsp;</label>
          <input type="email" placeholder="E-Mail ID" v-model="email" autocomplete="on" autofocus required>
        </div>
        <br>
        <div>
          <label> Password: &nbsp;</label>
          <input type="password" placeholder="Password" v-model="password" autocomplete="on" autofocus required>
        </div>
        <br>
        <div>
          <label> Re-Enter Password: &nbsp;</label>
          <input type="password" placeholder="Retype Password" v-model="cnf_pass" autocomplete="on" autofocus required>
        </div>
        <br>
        <div>
          <label> Choose your Role: &nbsp;</label>
          <select v-model="role" autocomplete="on" autofocus required>
            <option value=2> Administrator </option>
            <option value=1> Support Staff </option>
            <option value=0> Student </option>
          </select>
        </div>
        <br>
        <button type="submit" class="btn btn-outline-primary"> Register </button>
        <br>
      </center>
    </form>
    <center><h3> Already Registered? <router-link to="/"> LogIn </router-link></h3></center>
    <center v-if="error" class="alert alert-warning" role="alert">
      <p>{{error}}</p>
    </center>
  ` 
}

const Dashboard = {
  data() {
    return {
      email:null,
      role:null,
      status:null,
      error:null,
    }
  },
  methods: {
    deleteuser() {
      if(confirm("Are you sure want to delete ?")==true) {
        fetch(host + `/user/${this.$route.params.email}`, {
          method: "DELETE",
          headers: { "Content-Type":"application/json", },
        })
        .then((res) => {
          if(res.status == 404) {
            this.error="User not found"
          }
          else if(res.status == 401) {
            this.error="Unauthorised Access"
          }
          else if(res.status==200) {
            this.error="Registration Deleted Successfully | Go Back & Re-register"
          }
        })
        .catch(error => { console.log(error) })
      }
    },
    changerole() {
      fetch(host + `/user/${this.$route.params.email}`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", },
        body: JSON.stringify({role:this.role}),
      })
      .then((res) => {
        if(res.status == 404) {
          this.error="User not found"
        }
        else if(res.status == 401) {
          this.error="Unauthorised Access"
        }
        else if(res.status==200) {
          this.error="Role Changed Successfully | Wait for Approval"
        }
      })
      .catch(error => { console.log(error) })
    },
    users() {
      this.$router.push({
        path: `/users`
      })
    },
    tickets(r,e) {
      this.$router.push({
        path: `/${r}/tickets/${e}`
      })
    },
    user(e) {
      this.$router.push({
        path: `/user/${e}`
      })
    },
  },
  beforeCreate() {
    fetch(host + `/user/${this.$route.params.email}`, {
      method: "GET",
      headers: { "Content-Type":"application/json", },
    })
    .then((res) => {
      if(res.status == 401) {
        this.error="Unauthorised Access"
      }
      else if(res.status == 200) {
        res.json().then((data) => {
          this.email=data.email
          this.role=data.role
          this.status=data.status
        })
      }
    })
    .catch(error => { console.log(error) })
  },
  template: `
  <center v-if="error">
    <br>
    <h4> {{ this.error }} </h4>
    <button type="button" onclick="location='/logout'" autofocus> Return to HomePage </button>
  </center>
  <div v-else-if="status === 0">
    <center>
      <br>
      <h4> Your Registration Status is Pending <br> Please wait for Approval </h4>
      <button type="button" onclick="location='/logout'" autofocus> Return to HomePage </button>
    </center>
  </div>
  <div v-else-if="status === -1">
    <button type="button" class="position-fixed top-0 end-0" onclick="location='/logout'" autofocus> Log Out </button>
    <center>
      <br>
      <h4> Your Registration Status is Declined </h4>
      <br><br> 
      <h4> Either Delete your Current Registration & Re-register </h4>
      <br>
      <button class="btn btn-outline-primary" @click="deleteuser()"> Delete your Registration </button>
      <br><br>
      <h4> OR </h4>
      <br>
      <h4> Re-apply by changing your Role </h4>
      <br>
      <div>
        <form @submit.prevent="changerole" >
          <label> Change Your Role: &nbsp;</label>
          <select v-model="role" autocomplete="on" autofocus required>
            <option value=2> Administrator </option>
            <option value=1> Support Staff </option>
            <option value=0> Student </option>
          </select>
          <br>
          <button type="submit" class="btn btn-outline-primary"> Submit </button>
        </form>
      </div>
    </center>
  </div>
  <div v-else>
    <div v-if="role === 2">
      <center>
        <br>
        <h4> Hi <u> {{ this.email }} </u> , <br> Welcome to the Administrator Dashboard <h4>
        <br><br>
        <button class="btn btn-outline-dark btn-primary" @click="user(this.email)"> MY PROFILE </button>
        <br><br>
        <button class="btn btn-outline-dark btn-primary" @click="users()"> USERS </button>
        <br><br>
        <button class="btn btn-outline-dark btn-primary" @click="tickets(this.role,this.email)"> TICKETS </button>
        <br><br>
        <button type="button" class="position-fixed top-0 end-0" onclick="location='/logout'" autofocus> Log Out </button>
      </center>
    </div>
    <div v-else-if="role === 1">
      <center>
        <br>
        <h4> Hi <u> {{ this.email }} </u> , <br> Welcome to the Support Staff Dashboard <h4>
        <br><br>
        <button class="btn btn-outline-dark btn-primary" @click="user(this.email)"> MY PROFILE </button>
        <br><br>
        <button class="btn btn-outline-dark btn-primary" @click="tickets(this.role,this.email)"> TICKETS </button>
        <br><br>
        <button type="button" class="position-fixed top-0 end-0" onclick="location='/logout'" autofocus> Log Out </button>
      </center>
    </div>
    <div v-else-if="role === 0">
      <center>
        <br>
        <h4> Hi <u> {{ this.email }} </u> , <br> Welcome to the Student Dashboard <h4>
        <br><br>
        <button class="btn btn-outline-dark btn-primary" @click="user(this.email)"> MY PROFILE </button>
        <br><br>
        <button class="btn btn-outline-dark btn-primary" @click="tickets(this.role,this.email)"> TICKETS </button>
        <br><br>
        <button type="button" class="position-fixed top-0 end-0" onclick="location='/logout'" autofocus> Log Out </button>
      </center>
    </div>
  </div>
  `
}

const Users = {
  data() {
    return {
      current_email:null,
      pending:null,
      declined:null,
      admin:null,
      support:null,
      student:null,
      div:0,
      error:null,
      test:0,
    }
  },
  watch: {
    test: {
      handler() {
        fetch(host + `/user`, {
          method: "GET",
          headers: { "Content-Type":"application/json", },
        })
        .then((res) => {
          if(res.status == 401) {
            this.error="Unauthorised Access"
          }
          else if(res.status == 200) {
            res.json().then((data) => {
              this.pending=[]
              this.declined=[]
              this.admin=[]
              this.support=[]
              this.student=[]
              for (i of data) {
                if (i.status === 0) {
                  this.pending.push(i)
                }
                if (i.status === -1) {
                  this.declined.push(i)
                }
                if (i.status === 1 && i.role === 2) {
                  this.admin.push(i)
                }
                if (i.status === 1 && i.role === 1) {
                  this.support.push(i)
                }
                if (i.status === 1 && i.role === 0) {
                  this.student.push(i)
                }
              }
            })
          }
        })
        .catch(error => { console.log(error) })
      },
      immediate: true
    }
  },
  methods: {
    deleteuser(email) {
      if(confirm("Are you sure want to delete ?")==true) {
        fetch(host + `/user/${email}`, {
          method: "DELETE",
          headers: { "Content-Type":"application/json", },
        })
        .then((res) => {
          if(res.status == 404) {
            this.error="User not found"
          }
          else if(res.status == 401) {
            this.error="Unauthorised Access"
          }
          else if(res.status==200) {
            window.alert("User Deleted Successfully")
            this.test++
          }
        })
        .catch(error => { console.log(error) })
      }
    },
    edituser(email,r,s) {
      fetch(host + `/user/${email}`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", },
        body: JSON.stringify({role:r,status:s}),
      })
      .then((res) => {
        if(res.status == 404) {
          this.error="User not found"
        }
        else if(res.status == 401) {
          this.error="Unauthorised Access"
        }
        else if(res.status==200) {
          window.alert("User Updated Successfully")
          this.test++
        }
      })
      .catch(error => { console.log(error) })
    },
    usr(email) {
      this.$router.push({
        path: `/user/${email}`
      })
    },
    dash(email) {
      this.$router.push({
        path: `/${email}`
      })
    },
  },
  beforeCreate() {
    fetch(host + `/current`, {
      method: "GET",
      headers: { "Content-Type":"application/json", },
    })
    .then((res) => {
      if(res.status == 200) {
        res.json().then((data) => {
          this.current_email=data.email
        })
      }
    })
    .catch(error => { console.log(error) })
  },
  template:`
    <center v-if="error">
    <br>
    <h4> {{ this.error }} </h4>
    <button type="button" onclick="location='/logout'" autofocus> Return to HomePage </button>
    </center>
    <div v-else>
      <center class="position-fixed top-0 end-0">
        <tr><button class="btn-danger" onclick="location='/logout'" autofocus>&nbsp; Log Out &nbsp;</button></tr>
        <tr><button class="btn-info" @click="dash(current_email)"> Dashboard </button></tr>
      </center>
      <button class="btn btn-outline-dark btn-warning" @click="div=1"> Pending Users </button> 
      <button class="btn btn-outline-dark btn-danger" @click="div=2"> Declined Users </button>
      <button class="btn btn-outline-dark btn-primary" @click="div=3"> Administrator </button>
      <button class="btn btn-outline-dark btn-primary" @click="div=4"> Support Staff </button>
      <button class="btn btn-outline-dark btn-primary" @click="div=5"> Students </button>
      <div v-if="div === 1">
        <table class="table table-hover table-dark">
          <thead> 
            <tr>
              <th> E-Mail </th>
              <th> Delete </th>
              <th> Change Role </th>
              <th> Change Status </th>
              <th> Action </th>
            </tr>
          </thead>
          <tbody v-for="user in pending">
            <tr>
              <td> <u @click="usr(user.email)" style="color:cyan;"> <b> {{ user.email }} </b> </u> </td>
              <td><button @click="deleteuser(user.email)" class="btn btn-danger">Delete</button></td>
              <td>
                <select v-model="user.role" autocomplete="on" autofocus required>
                  <option value=2> Administrator </option>
                  <option value=1> Support Staff </option>
                  <option value=0> Student </option>
                </select>
              </td>
              <td>
                <select v-model="user.status" autocomplete="on" autofocus required>
                  <option value=-1> Decline </option>
                  <option value=1> Approve </option>
                  <option value=0> Pending </option>
                </select>
              </td>
              <td>
                <button @click="edituser(user.email,user.role,user.status)" class="btn btn-outline-primary"> Submit </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="div === 2">
        <table class="table table-hover table-dark">
          <thead> 
            <tr>
              <th> E-Mail </th>
              <th> Delete </th>
              <th> Change Role </th>
              <th> Change Status </th>
              <th> Action </th>
            </tr>
          </thead>
          <tbody v-for="user in declined">
            <tr>
              <td> <u @click="usr(user.email)" style="color:cyan;"> <b> {{ user.email }} </b> </u> </td>
              <td><button @click="deleteuser(user.email)" class="btn btn-danger">Delete</button></td>
              <td>
                <select v-model="user.role" autocomplete="on" autofocus required>
                  <option value=2> Administrator </option>
                  <option value=1> Support Staff </option>
                  <option value=0> Student </option>
                </select>
              </td>
              <td>
                <select v-model="user.status" autocomplete="on" autofocus required>
                  <option value=-1> Decline </option>
                  <option value=1> Approve </option>
                  <option value=0> Pending </option>
                </select>
              </td>
              <td>
                <button @click="edituser(user.email,user.role,user.status)" class="btn btn-outline-primary"> Submit </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="div === 3">
        <table class="table table-hover table-dark">
          <thead> 
            <tr>
              <th> E-Mail </th>
              <th> Delete </th>
            </tr>
          </thead>
          <tbody v-for="user in admin">
            <tr>
              <td> <u @click="usr(user.email)" style="color:cyan;"> <b> {{ user.email }} </b> </u> </td>
              <td><button @click="deleteuser(user.email)" class="btn btn-danger">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="div === 4">
        <table class="table table-hover table-dark">
          <thead> 
            <tr>
              <th> E-Mail </th>
              <th> Delete </th>
            </tr>
          </thead>
          <tbody v-for="user in support">
            <tr>
              <td> <u @click="usr(user.email)" style="color:cyan;"> <b> {{ user.email }} </b> </u> </td>
              <td><button @click="deleteuser(user.email)" class="btn btn-danger">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="div === 5">
        <table class="table table-hover table-dark">
          <thead> 
            <tr>
              <th> E-Mail </th>
              <th> Delete </th>
            </tr>
          </thead>
          <tbody v-for="user in student">
            <tr>
              <td> <u @click="usr(user.email)" style="color:cyan;"> <b> {{ user.email }} </b> </u> </td>
              <td><button @click="deleteuser(user.email)" class="btn btn-danger">Delete</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
}

const User = {
  data() {
    return {
      current_email:null,
      password:null,
      email:null,
      role:null,
      status:null,
      tickets:null,
      activity:[],
      edit:null,
      error:null,
    }
  },
  methods: {
    async show_activity() {
      this.activity=[]
      for(ticket of this.tickets) {
        res = await fetch(host + `/ticket/${ticket.id}/content`, {
          method: "GET",
          headers: { "Content-Type":"application/json", },
        })
        .catch(error => { console.log(error) })
        if(res.status == 401) {
          this.error="Unauthorised Access"
        }
        else if(res.status == 200) {
          json = await res.json()
          count=0
          for(content of json) {
            if(content.user_email == this.email) {
              count++
            }
          }
          if(count > 0) {
            temp = {}
            temp['id'] = ticket.id
            temp['title'] = ticket.title
            temp['likes'] = ticket.likes
            if(ticket.status === 0) {
              temp['status'] = 'Pending'
            }
            if(ticket.status === 1) {
              temp['status'] = 'Resolved'
            }
            if(ticket.is_faq === 0) {
              temp['is_faq'] = 'No'
            }
            if(ticket.is_faq === 1) {
              temp['is_faq'] = 'Yes'
            }
            temp['replies'] = count
            this.activity.push(temp)
          }
        }
      }
      this.edit = 0
    },
    tick(id) {
      this.$router.push({
        path: `/ticket/${id}`
      })
    },
    dash(email) {
      this.$router.push({
        path: `/${email}`
      })
    },
    change_password() {
      fetch(host + `/user/${this.email}`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", },
        body: JSON.stringify({password:this.password}),
      })
      .then((res) => {
        if(res.status == 404) {
          this.error="User not found"
        }
        else if(res.status == 401) {
          this.error="Unauthorised Access"
        }
        else if(res.status==200) {
          window.alert("Password Updated Successfully")
          this.edit=null
          this.password=null
        }
      })
      .catch(error => { console.log(error) })
    }  
  },
  beforeCreate() {
    fetch(host + `/current`, {
      method: "GET",
      headers: { "Content-Type":"application/json", },
    })
    .then((res) => {
      if(res.status == 200) {
        res.json().then((data) => {
          this.current_email=data.email
        })
      }
    })
    .catch(error => { console.log(error) })
    fetch(host + `/user/${this.$route.params.email}`, {
      method: "GET",
      headers: { "Content-Type":"application/json", },
    })
    .then((res) => {
      if(res.status == 401) {
        this.error="Unauthorised Access"
      }
      else if(res.status == 200) {
        res.json().then((data) => {
          this.email=data.email
          if(data.role === 2) {
            this.role = 'Administrator'
          }
          if(data.role === 1) {
            this.role = 'Support Staff'
          }
          if(data.role === 0) {
            this.role = 'Student'
          }
          if(data.status === 1) {
            this.status = 'Approved'
          }
          if(data.status === 0) {
            this.status = 'Pending'
          }
          if(data.status === -1) {
            this.status = 'Declined'
          }
        })
      }
    })
    .catch(error => { console.log(error) })
    fetch(host + `/ticket`, {
      method: "GET",
      headers: { "Content-Type":"application/json", },
    })
    .then((res) => {
      if(res.status == 401) {
        this.error="Unauthorised Access"
      }
      else if(res.status == 200) {
        res.json().then((data) => {
          this.tickets=data
        })
      }
    })
    .catch(error => { console.log(error) })
  },
  template:`
    <center v-if="error">
    <br>
    <h4> {{ this.error }} </h4>
    <button type="button" onclick="location='/logout'" autofocus> Return to HomePage </button>
    </center>
    <div v-else>
      <center class="position-fixed top-0 end-0">
        <tr><button class="btn-danger" onclick="location='/logout'" autofocus>&nbsp; Log Out &nbsp;</button></tr>
        <tr><button class="btn-info" @click="dash(current_email)"> Dashboard </button></tr>
      </center>
      <div style="border:10px double black;border-left:20px solid DarkCyan;">
        <h4> <b> {{ this.email }} </b> </h4>
        <tr>
          <td>
            <h6> {{ this.role }} </h6>
            <p> [ {{ this.status }} ] </p>
          </td>
          <td> <p class="position-absolute end-0">
            <button v-if="current_email == email" class="btn btn-primary" @click="edit=1"> Change Password </button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p> </td>
        </tr>
        <tr v-if="edit === 1">
          <td> <p> New Password : <input type="password" v-model="password"> </p> </td>
          <td> <p class="position-absolute end-0">
            <button @click="change_password()" class="btn btn-info"> Submit </button> &nbsp;&nbsp;&nbsp;
          </p> </td>
        </tr>
      </div>
      <br>
      <center>
        <button class="btn btn-info" @click="show_activity"> Show Activity </button>
      </center>
      <br><br>
      <div v-if="edit === 0">
        <table class="table table-hover table-dark">
          <thead>
            <tr>
              <th> Ticket ID </th>
              <th> Title </th>
              <th> Likes </th>
              <th> Status </th>
              <th> Is_FAQ </th>
              <th> No. of Replies </th>
            </tr>
          </thead>
          <tbody v-for="i in activity">       
            <tr>
              <td> <u @click="tick(i.id)" style="color:cyan;"> <b> {{ i.id }} </b> </u> </td>
              <td> {{ i.title }} </td>
              <td> <span style="color:red;"> &#9829 </span> {{ i.likes }} </td>
              <td> {{ i.status }} </td>
              <td> {{ i.is_faq }} </td>
              <td> {{ i.replies }} </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
}

const Tickets = {
  data() {
    return {
      current_email:null,
      faq:null,
      all:null,
      pending:null,
      resolved:null,
      own:null,
      edit:null,
      div:0,
      title:null,
      tags:null,
      desc:null,
      likes:null,
      error:null,
      test:0,
    }
  },
  watch: {
    test: {
      handler() {
        fetch(host + `/ticket`, {
          method: "GET",
          headers: { "Content-Type":"application/json", },
        })
        .then((res) => {
          if(res.status == 401) {
            this.error="Unauthorised Access"
          }
          else if(res.status == 200) {
            res.json().then((data) => {
              this.faq=[]
              this.all=[]
              this.pending=[]
              this.resolved=[]
              this.own=[]
              for (i of data) {
                this.all.push(i)
                if (i.is_faq === 1) {
                  this.faq.push(i)
                }
                if (i.status === 1) {
                  this.resolved.push(i)
                }
                if (i.status === 0) {
                  this.pending.push(i)
                }
                if (i.user_email === this.$route.params.email) {
                  this.own.push(i)
                }
              }
            })
          }
        })
        .catch(error => { console.log(error) })
        if(this.$route.params.role == 0) {
          this.edit = null
          fetch(host + `/like`, {
            method: "GET",
            headers: { "Content-Type":"application/json", },
          })
          .then((res) => {
            if(res.status == 401) {
              this.error="Unauthorised Access"
            }
            else if(res.status == 200) {
              res.json().then((data) => {
                this.likes=[]
                for (i of data[this.$route.params.email]) {
                  this.likes.push(i)
                }
              })
            }
          })
          .catch(error => { console.log(error) })
        }
      },
      immediate: true
    }
  },
  methods: {
    deleteticket(id) {
      if(confirm("Are you sure want to delete ?")==true) {
        fetch(host + `/ticket/${id}`, {
          method: "DELETE",
          headers: { "Content-Type":"application/json", },
        })
        .then((res) => {
          if(res.status == 404) {
            this.error="Ticket not found"
          }
          else if(res.status == 401) {
            this.error="Unauthorised Access"
          }
          else if(res.status==200) {
            window.alert("Ticket Deleted Successfully")
            this.test++
          }
        })
        .catch(error => { console.log(error) })
      }
    },
    editticket(id,f,s) {
      data = null
      if(this.$route.params.role == 2) {
        data = JSON.stringify({is_faq:f,status:s})
      }
      if(this.$route.params.role == 1) {
        data = JSON.stringify({status:s})
      }
      fetch(host + `/ticket/${id}`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", },
        body: data,
      })
      .then((res) => {
        if(res.status == 404) {
          this.error="Ticket not found"
        }
        else if(res.status == 401) {
          this.error="Unauthorised Access"
        }
        else if(res.status==200) {
          window.alert("Ticket Updated Successfully")
          this.test++
        }
      })
      .catch(error => { console.log(error) })
    },
    updateticket(id,title,tags,desc) {
      fetch(host + `/ticket/${id}`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", },
        body: JSON.stringify({title:title,tags:tags,desc:desc}),
      })
      .then((res) => {
        if(res.status == 404) {
          this.error="Ticket not found"
        }
        else if(res.status == 401) {
          this.error="Unauthorised Access"
        }
        else if(res.status==200) {
          window.alert("Ticket Updated Successfully")
          this.test++
        }
      })
      .catch(error => { console.log(error) })
    },
    createticket() {
      fetch(host + `/ticket`, {
        method: "POST",
        headers: { "Content-Type":"application/json", },
        body: JSON.stringify({title:this.title,tags:this.tags,desc:this.desc}),
      })
      .then((res) => {
        if(res.status == 401) {
          this.error="Unauthorised Access"
        }
        else if(res.status==200) {
          window.alert("Ticket Created Successfully")
          this.title=null
          this.tags=null
          this.desc=null
          this.test++
        }
      })
      .catch(error => { console.log(error) })
    },
    tick(id) {
      this.$router.push({
        path: `/ticket/${id}`
      })
    },
    dash(email) {
      this.$router.push({
        path: `/${email}`
      })
    },
    is_liked(id) {
      for(i of this.likes) {
        if(id == i) {
          return true
        }
      }
      return false
    },
    like(b,id) {
      if(b == true) {
        fetch(host + `/ticket/${id}/like`, {
          method: "DELETE",
          headers: { "Content-Type":"application/json", },
        })
        .then((res) => {
          if(res.status == 401) {
            this.error="Unauthorised Access"
          }
          else if(res.status==200) {
            this.test++
          }
        })
        .catch(error => { console.log(error) })
      }
      else {
        fetch(host + `/ticket/${id}/like`, {
          method: "POST",
          headers: { "Content-Type":"application/json", },
        })
        .then((res) => {
          if(res.status == 401) {
            this.error="Unauthorised Access"
          }
          else if(res.status==200) {
            this.test++
          }
        })
        .catch(error => { console.log(error) })
      }
    },
  },
  beforeCreate() {
    fetch(host + `/current`, {
      method: "GET",
      headers: { "Content-Type":"application/json", },
    })
    .then((res) => {
      if(res.status == 200) {
        res.json().then((data) => {
          this.current_email=data.email
        })
      }
    })
    .catch(error => { console.log(error) })
  },
  template:`
    <center v-if="error">
    <br>
    <h4> {{ this.error }} </h4>
    <button type="button" onclick="location='/logout'" autofocus> Return to HomePage </button>
    </center>
    <div v-else>
      <center class="position-fixed top-0 end-0">
        <tr><button class="btn-danger" onclick="location='/logout'" autofocus>&nbsp; Log Out &nbsp;</button></tr>
        <tr><button class="btn-info" @click="dash(current_email)"> Dashboard </button></tr>
      </center>
      <div v-if="$route.params.role == 2">
        <button class="btn btn-outline-dark btn-success" @click="div=1"> FAQ </button>
        <button class="btn btn-outline-dark btn-primary" @click="div=2"> All </button>
        <div v-if="div === 1">
          <table class="table table-hover table-dark">
            <thead> 
              <tr>
                <th> ID </th>
                <th> Title </th>
                <th> Likes </th>
                <th> Delete </th>
                <th> Is_FAQ </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody v-for="ticket in faq">
              <tr>
                <td> <u @click="tick(ticket.id)" style="color:cyan;"> <b> {{ ticket.id }} </b> </u> </td>
                <td> {{ ticket.title }} </td>
                <td> <span style="color:red;"> &#9829 </span> {{ ticket.likes }} </td>
                <td><button @click="deleteticket(ticket.id)" class="btn btn-danger">Delete</button></td>
                <td>
                  <select v-model="ticket.is_faq" autocomplete="on" autofocus required>
                    <option value=1> Yes </option>
                    <option value=0> No </option>
                  </select>
                </td>
                <td>
                  <button @click="editticket(ticket.id,ticket.is_faq,ticket.status)" class="btn btn-outline-primary"> Submit </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="div === 2">
          <table class="table table-hover table-dark">
            <thead> 
              <tr>
                <th> ID </th>
                <th> Title </th>
                <th> Likes </th>
                <th> Delete </th>
                <th> Status </th>
                <th> Is_FAQ </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody v-for="ticket in all">
              <tr>
                <td> <u @click="tick(ticket.id)" style="color:cyan;"> <b> {{ ticket.id }} </b> </u> </td>
                <td> {{ ticket.title }} </td>
                <td> <span style="color:red;"> &#9829 </span> {{ ticket.likes }} </td>
                <td><button @click="deleteticket(ticket.id)" class="btn btn-danger">Delete</button></td>
                <td>
                  <select v-model="ticket.status" autocomplete="on" autofocus required>
                    <option value=1> Resolved </option>
                    <option value=0> Pending </option>
                  </select>
                </td>
                <td>
                  <select v-model="ticket.is_faq" autocomplete="on" autofocus required>
                    <option value=1> Yes </option>
                    <option value=0> No </option>
                  </select>
                </td>
                <td>
                  <button @click="editticket(ticket.id,ticket.is_faq,ticket.status)" class="btn btn-outline-primary"> Submit </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="$route.params.role == 1">
        <button class="btn btn-outline-dark btn-primary" @click="div=1"> FAQ </button>
        <button class="btn btn-outline-dark btn-info" @click="div=2"> All </button>
        <button class="btn btn-outline-dark btn-success" @click="div=3"> Resolved </button>
        <button class="btn btn-outline-dark btn-warning" @click="div=4"> Pending </button>
        <div v-if="div === 1">
          <table class="table table-hover table-dark">
            <thead> 
              <tr>
                <th> ID </th>
                <th> Title </th>
                <th> Likes </th>
              </tr>
            </thead>
            <tbody v-for="ticket in faq">
              <tr>
                <td> <u @click="tick(ticket.id)" style="color:cyan;"> <b> {{ ticket.id }} </b> </u> </td>
                <td> {{ ticket.title }} </td>
                <td> <span style="color:red;"> &#9829 </span> {{ ticket.likes }} </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="div === 2">
          <table class="table table-hover table-dark">
            <thead> 
              <tr>
                <th> ID </th>
                <th> Title </th>
                <th> Likes </th>
                <th> Status </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody v-for="ticket in all">
              <tr>
                <td> <u @click="tick(ticket.id)" style="color:cyan;"> <b> {{ ticket.id }} </b> </u> </td>
                <td> {{ ticket.title }} </td>
                <td> <span style="color:red;"> &#9829 </span> {{ ticket.likes }} </td>
                <td>
                  <select v-model="ticket.status" autocomplete="on" autofocus required>
                    <option value=1> Resolved </option>
                    <option value=0> Pending </option>
                  </select>
                </td>
                <td>
                  <button @click="editticket(ticket.id,ticket.is_faq,ticket.status)" class="btn btn-outline-primary"> Submit </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="div === 3">
          <table class="table table-hover table-dark">
            <thead> 
              <tr>
                <th> ID </th>
                <th> Title </th>
                <th> Likes </th>
                <th> Status </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody v-for="ticket in resolved">
              <tr>
                <td> <u @click="tick(ticket.id)" style="color:cyan;"> <b> {{ ticket.id }} </b> </u> </td>
                <td> {{ ticket.title }} </td>
                <td> <span style="color:red;"> &#9829 </span> {{ ticket.likes }} </td>
                <td>
                  <select v-model="ticket.status" autocomplete="on" autofocus required>
                    <option value=1> Resolved </option>
                    <option value=0> Pending </option>
                  </select>
                </td>
                <td>
                  <button @click="editticket(ticket.id,ticket.is_faq,ticket.status)" class="btn btn-outline-primary"> Submit </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="div === 4">
          <table class="table table-hover table-dark">
            <thead> 
              <tr>
                <th> ID </th>
                <th> Title </th>
                <th> Likes </th>
                <th> Status </th>
                <th> Action </th>
              </tr>
            </thead>
            <tbody v-for="ticket in pending">
              <tr>
                <td> <u @click="tick(ticket.id)" style="color:cyan;"> <b> {{ ticket.id }} </b> </u> </td>
                <td> {{ ticket.title }} </td>
                <td> <span style="color:red;"> &#9829 </span> {{ ticket.likes }} </td>
                <td>
                  <select v-model="ticket.status" autocomplete="on" autofocus required>
                    <option value=1> Resolved </option>
                    <option value=0> Pending </option>
                  </select>
                </td>
                <td>
                  <button @click="editticket(ticket.id,ticket.is_faq,ticket.status)" class="btn btn-outline-primary"> Submit </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="$route.params.role == 0">
        <button class="btn btn-outline-dark btn-primary" @click="div=1"> FAQ </button>
        <button class="btn btn-outline-dark btn-info" @click="div=2"> All </button>
        <button class="btn btn-outline-dark btn-primary" @click="div=3"> My Tickets </button>
        <button class="btn btn-outline-dark btn-success" @click="div=4"> Create Ticket </button>
        <div v-if="div === 1">
          <table class="table table-hover table-dark">
            <thead> 
              <tr>
                <th> ID </th>
                <th> Title </th>
                <th> Likes </th>
              </tr>
            </thead>
            <tbody v-for="ticket in faq">
              <tr>
                <td> <u @click="tick(ticket.id)" style="color:cyan;"> <b> {{ ticket.id }} </b> </u> </td>
                <td> {{ ticket.title }} </td>
                <td> <span style="color:red;"> &#9829 </span> {{ ticket.likes }} </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="div === 2">
          <table class="table table-hover table-dark">
            <thead> 
              <tr>
                <th> ID </th>
                <th> Title </th>
                <th> Likes </th>
                <th> Like </th>
              </tr>
            </thead>
            <tbody v-for="ticket in all">
              <tr>
                <td> <u @click="tick(ticket.id)" style="color:cyan;"> <b> {{ ticket.id }} </b> </u> </td>
                <td> {{ ticket.title }} </td>
                <td> <span style="color:red;"> &#9829 </span> {{ ticket.likes }} </td>
                <td>
                  <button @click="like(is_liked(ticket.id),ticket.id)" class="btn btn-outline-light" :class="{'btn-danger':is_liked(ticket.id)}"> &#9829 </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="div === 3">
          <table class="table table-hover table-dark">
            <thead> 
              <tr>
                <th> ID </th>
                <th> Title </th>
                <th> Edit </th>
                <th> Tags </th>
                <th> Likes </th>
                <th> Description </th>
                <th> Delete </th>
              </tr>
            </thead>
            <tbody v-for="ticket in own">
              <tr>
                <td> <u @click="tick(ticket.id)" style="color:cyan;"> <b> {{ ticket.id }} </b> </u> </td>
                <td> {{ ticket.title }} </td>
                <td> <button class="btn btn-outline-info" @click="edit=ticket.id"> Edit </button> </td>
                <td> {{ ticket.tags }} </td>
                <td> <span style="color:red;"> &#9829 </span> {{ ticket.likes }} </td>
                <td> {{ ticket.desc }} </td>
                <td> <button @click="deleteticket(ticket.id)" class="btn btn-danger">Delete</button> </td>
              </tr>
              <tr v-if="edit == ticket.id">
                  <td> New Title : </td>
                  <td> <input type="text" v-model="ticket.title"></td>
                  <td> New Tags : </td>
                  <td> <input type="text" v-model="ticket.tags"></td>
                  <td> New Description : </td>
                  <td> <input type="text" v-model="ticket.desc"></td>
                  <td> <button type="submit" @click="updateticket(ticket.id,ticket.title,ticket.tags,ticket.desc)" class="btn btn-outline-primary"> Submit </button></td>
              </tr>
            </tbody>                   
          </table>
        </div>
        <div v-if="div === 4">
          <form @submit.prevent="createticket()" >
            <center>
              <br>
              <h4> Create Ticket </h4>
              <br>
              <div>
                <label> Title: &nbsp;</label>
                <input type="text" placeholder="Title" v-model="title" autocomplete="on" autofocus required>
              </div>
              <br>
              <div>
                <label> Tags: &nbsp;</label>
                <input type="text" placeholder="Tags" v-model="tags" autocomplete="on" autofocus required>
              </div>
              <br>
              <div>
                <label> Description: &nbsp;</label>
                <input type="text" placeholder="Description" v-model="desc" autocomplete="on" autofocus required>
              </div>
              <br>
              <div>
                <label> Image (Optional): &nbsp;</label>
                <input type="file">
              </div>
              <br>
              <div>
                <button type="submit" class="btn btn-outline-primary"> Submit </button>
              </div>
            </center> 
          </form>               
        </div>
      </div>
    </div>
  `
}

const Ticket = {
  data() {
    return {
      id:null,
      email:null,
      title:null,
      tags:null,
      desc:null,
      likes:null,
      timestamp:null,
      contents:null,
      text:null,
      edit:null,
      current_email:null,
      current_role:null,
      current_status:null,
      error:null,
      test:0,
    }
  },
  methods: {
    deletecontent(id,i) {
      if(confirm("Are you sure want to delete ?")==true) {
        fetch(host + `/ticket/${id}/content/${i}`, {
          method: "DELETE",
          headers: { "Content-Type":"application/json", },
        })
        .then((res) => {
          if(res.status == 404) {
            this.error="Content not found"
          }
          else if(res.status == 401) {
            this.error="Unauthorised Access"
          }
          else if(res.status==200) {
            window.alert("Content Deleted Successfully")
            this.test++
          }
        })
        .catch(error => { console.log(error) })
      }
    },
    updatecontent(id,i,text) {
      fetch(host + `/ticket/${id}/content/${i}`, {
        method: "PUT",
        headers: { "Content-Type":"application/json", },
        body: JSON.stringify({text:text}),
      })
      .then((res) => {
        if(res.status == 404) {
          this.error="Content not found"
        }
        else if(res.status == 401) {
          this.error="Unauthorised Access"
        }
        else if(res.status==200) {
          window.alert("Content Updated Successfully")
          this.test++
        }
      })
      .catch(error => { console.log(error) })
    },
    createcontent() {
      fetch(host + `/ticket/${this.id}/content`, {
        method: "POST",
        headers: { "Content-Type":"application/json", },
        body: JSON.stringify({text:this.text}),
      })
      .then((res) => {
        if(res.status == 401) {
          this.error="Unauthorised Access"
        }
        else if(res.status==200) {
          window.alert("Content Created Successfully")
          this.test++
        }
      })
      .catch(error => { console.log(error) })
    },
    edit_access(e) {
      return this.current_email == e
    },
    delete_access(e) {
      if(this.current_email == e || (this.current_role == 2 && this.current_status == 1)) {
        return true
      }
      else {
        return false
      }
    },
    dash(email) {
      this.$router.push({
        path: `/${email}`
      })
    },
  },
  watch: {
    test: {
      handler() {
        fetch(host + `/ticket/${this.$route.params.id}/content`, {
          method: "GET",
          headers: { "Content-Type":"application/json", },
        })
        .then((res) => {
          if(res.status == 401) {
            this.error="Unauthorised Access"
          }
          else if(res.status == 200) {
            res.json().then((data) => {
              this.contents=data
            })
          }
        })
        .catch(error => { console.log(error) })
        this.text=null
        this.edit=null
      },
      immediate: true
    },
  },
  beforeCreate() {
    fetch(host + `/ticket/${this.$route.params.id}`, {
      method: "GET",
      headers: { "Content-Type":"application/json", },
    })
    .then((res) => {
      if(res.status == 401) {
        this.error="Unauthorised Access"
      }
      else if(res.status == 200) {
        res.json().then((data) => {
          this.id=this.$route.params.id
          this.email=data.user_email
          this.title=data.title
          this.tags=data.tags
          this.desc=data.desc
          this.likes=data.likes
          this.timestamp=data.timestamp
        })
      }
    })
    .catch(error => { console.log(error) })
    fetch(host + `/current`, {
      method: "GET",
      headers: { "Content-Type":"application/json", },
    })
    .then((res) => {
      if(res.status == 200) {
        res.json().then((data) => {
          this.current_email=data.email
          this.current_role=data.role
          this.current_status=data.status
        })
      }
    })
    .catch(error => { console.log(error) })
  },
  template: `
    <center v-if="error">
    <br>
    <h4> {{ this.error }} </h4>
    <button type="button" onclick="location='/logout'" autofocus> Return to HomePage </button>
    </center>
    <div v-else>
      <center class="position-fixed top-0 end-0">
        <tr><button class="btn-danger" onclick="location='/logout'" autofocus>&nbsp; Log Out &nbsp;</button></tr>
        <tr><button class="btn-info" @click="dash(current_email)"> Dashboard </button></tr>
      </center>
      <div style="border:2px double black;border-left:10px solid DarkCyan;">
        <h3> <b> {{ this.title }} </b> </h3>
        <p> {{ this.tags }} </p>
        <tr>
          <td> <h6> {{ this.email }} </h6> </td>
          <td> <p class="position-absolute end-0"> {{ this.timestamp }} &nbsp;</p> </td>
        </tr>
        <tr>
          <td> <p> {{ this.desc }} </p> </td>
          <td> <p class="position-absolute end-0">
          <h4 style="color:red;" class="position-absolute end-0">
          &#9829 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h4>
          {{ this.likes }} &nbsp;&nbsp;</p> </td>
        </tr>
      </div>
      <div v-for="content in contents">
        <br>
        <div style="border:2px double black;border-left:10px solid Cyan;">
          <tr>
            <td> <h6> {{ content.user_email }} </h6> </td>
            <td> <p class="position-absolute end-0"> {{ content.timestamp }} &nbsp;</p> </td>
          </tr>
          <tr>
            <td> <p> {{ content.text }} </p> </td>
            <td> <p class="position-absolute end-0">
              <button v-if="edit_access(content.user_email)" class="btn btn-primary" @click="edit=content.id"> Edit </button> &nbsp;
              <button v-if="delete_access(content.user_email)" @click="deletecontent(this.id,content.id)" class="btn btn-danger"> Delete </button> &nbsp;
            </p> </td>
          </tr>
          <tr v-if="edit == content.id">
            <td> <p> New Text : <input type="text" v-model="content.text"> </p> </td>
            <td> <p class="position-absolute end-0">
              <button @click="updatecontent(this.id,content.id,content.text)" class="btn btn-info"> Submit </button> &nbsp;
            </p> </td>
          </tr>
        </div>
      </div>
      <center>
        <br>
        <tr v-if="edit === 0">
          <td> <p> <input type="text" v-model="text" placeholder="ENTER TEXT" size=32> </p> </td>
          <td> <p class="position-absolute end-0">
            <button @click="createcontent()" class="btn btn-info"> Post </button> &nbsp;
          </p> </td>
        </tr>
        <br>
        <button class="btn btn-primary" @click="edit=0"> Reply </button>
        <br><br>
      </center>
    </div>
  `
}

const routes = [
  { path: '/', component: Home },
  { path: '/register', component: Register },
  { path: '/:email', component: Dashboard },
  { path: '/users', component: Users },
  { path: '/user/:email', component: User },
  { path: '/:role/tickets/:email', component: Tickets },
  { path: '/ticket/:id', component: Ticket },
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
})
const app = Vue.createApp({})
app.use(router)
app.mount('#app')
