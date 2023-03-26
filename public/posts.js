async function buildPostsTable(postsTable, postsTableHeader, token, message) {
  try {
    const response = await fetch("/api/v1/posts/my-posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    var children = [postsTableHeader];
    if (response.status === 200) {
      if (data.count === 0) {
        postsTable.replaceChildren(...children); // clear this for safety
        return 0;
      } else {
        for (let i = 0; i < data.posts.length; i++) {
          let editButton = `<td><button type="button" class="editButton" data-id=${data.posts[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.posts[i]._id}>delete</button></td>`;
          let rowHTML = `<td>${data.posts[i].title}</td><td>${data.posts[i].body}</td><td>${data.posts[i].status}</td>${editButton}${deleteButton}`;
          let rowEntry = document.createElement("tr");
          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        postsTable.replaceChildren(...children);
      }
      return data.count;
    } else {
      message.textContent = data.msg;
      return 0;
    }
  } catch (err) {
    message.textContent = "A communication error occurred.";
    return 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logoff = document.getElementById("logoff");
  const message = document.getElementById("message");
  const logonRegister = document.getElementById("logon-register");
  const logon = document.getElementById("logon");
  const register = document.getElementById("register");
  const logonDiv = document.getElementById("logon-div");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const logonButton = document.getElementById("logon-button");
  const logonCancel = document.getElementById("logon-cancel");
  const registerDiv = document.getElementById("register-div");
  const name = document.getElementById("name");
  const email1 = document.getElementById("email1");
  const password1 = document.getElementById("password1");
  const password2 = document.getElementById("password2");
  const registerButton = document.getElementById("register-button");
  const registerCancel = document.getElementById("register-cancel");
  const posts = document.getElementById("posts");
  const postsTable = document.getElementById("posts-table");
  const postsTableHeader = document.getElementById("posts-table-header");
  const addPost = document.getElementById("add-post");
  const editPost = document.getElementById("edit-post");
  const title = document.getElementById("title");
  const body = document.getElementById("body");
  const status = document.getElementById("status");
  const addingPost = document.getElementById("adding-post");
  const postsMessage = document.getElementById("posts-message");
  const editCancel = document.getElementById("edit-cancel");

  // section 2 

  let showing = logonRegister;
  let token = null;
  document.addEventListener("startDisplay", async () => {
    showing = logonRegister;
    token = localStorage.getItem("token");
    if (token) {
      //if the user is logged in
      logoff.style.display = "block";
      const count = await buildPostsTable(
        postsTable,
        postsTableHeader,
        token,
        message
      );

      if (count > 0) {
        postsMessage.textContent = "";
        postsTable.style.display = "block";
      } else {
        postsMessage.textContent = "There are no posts to display for this user.";
        postsTable.style.display = "none";
      }
      posts.style.display = "block";
      showing = posts;
    } else {
      logonRegister.style.display = "block";
    }
  });

  var thisEvent = new Event("startDisplay");
  document.dispatchEvent(thisEvent);
  var suspendInput = false;

  // section 3
  document.addEventListener("click", async (e) => {
    if (suspendInput) {
      return; // we don't want to act on buttons while doing async operations
    }
    if (e.target.nodeName === "BUTTON") {
      message.textContent = "";
    }
    if (e.target === logoff) {
      localStorage.removeItem("token");
      token = null;
      showing.style.display = "none";
      logonRegister.style.display = "block";
      showing = logonRegister;
      postsTable.replaceChildren(postsTableHeader); // don't want other users to see
      message.textContent = "You are logged off.";
    } else if (e.target === logon) {
      showing.style.display = "none";
      logonDiv.style.display = "block";
      showing = logonDiv;
    } else if (e.target === register) {
      showing.style.display = "none";
      registerDiv.style.display = "block";
      showing = registerDiv;
    } else if (e.target === logonCancel || e.target == registerCancel) {
      showing.style.display = "none";
      logonRegister.style.display = "block";
      showing = logonRegister;
      email.value = "";
      password.value = "";
      name.value = "";
      email1.value = "";
      password1.value = "";
      password2.value = "";
    } else if (e.target === logonButton) {
      suspendInput = true;
      try {
        const response = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.value,
            password: password.value,
          }),
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = `Logon successful.  Welcome ${data.user.name}`;
          token = data.token;
          localStorage.setItem("token", token);
          showing.style.display = "none";
          thisEvent = new Event("startDisplay");
          email.value = "";
          password.value = "";
          document.dispatchEvent(thisEvent);
        } else {
          message.textContent = data.msg;
        }
      } catch (err) {
        message.textContent = "A communications error occurred.";
      }
      suspendInput = false;
    } else if (e.target === registerButton) {
      if (password1.value != password2.value) {
        message.textContent = "The passwords entered do not match.";
      } else {
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: name.value,
              email: email1.value,
              password: password1.value,
            }),
          });
          const data = await response.json();

          console.log(response.status);
          if (response.status === 201) {
            message.textContent = `Registration successful.  Welcome ${data.user.name}`;
            token = data.token;
            localStorage.setItem("token", token);
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            name.value = "";
            email1.value = "";
            password1.value = "";
            password2.value = "";
          } else { 
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communications error occurred.";
        }
        suspendInput = false;
      }
    } // section 4 
    else if (e.target === addPost) {
      showing.style.display = "none";
      editPost.style.display = "block";
      showing = editPost;
      delete editPost.dataset.id;
      title.value = "";
      body.value = "";
      status.value = "public";
      addingPost.textContent = "add";
    } else if (e.target === editCancel) {
      showing.style.display = "none";
      title.value = "";
      body.value = "";
      status.value = "public";
      thisEvent = new Event("startDisplay");
      document.dispatchEvent(thisEvent);
    } else if (e.target === addingPost) {

      if (!editPost.dataset.id) {
        // this is an attempted add
        suspendInput = true;
        try {
          const response = await fetch("/api/v1/posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: title.value,
              body: body.value,
              status: status.value,
            }),
          });
          const data = await response.json();
          if (response.status === 201) {
            //successful create
            message.textContent = "The post was created.";
            showing.style.display = "none";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
            title.value = "";
            body.value = "";
            status.value = "public";
          } else {
            // failure
            message.textContent = data.msg;
          }
        } catch (err) {
          message.textContent = "A communication error occurred.";
        }
        suspendInput = false;
      } else {
        // this is an update
        suspendInput = true;
        try {
          const postID = editPost.dataset.id;
          const response = await fetch(`/api/v1/posts/${postID}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: title.value,
              body: body.value,
              status: status.value,
            }),
          });
          const data = await response.json();
          if (response.status === 200) {
            message.textContent = "The post was updated.";
            showing.style.display = "none";
            title.value = "";
            body.value = "";
            status.value = "public";
            thisEvent = new Event("startDisplay");
            document.dispatchEvent(thisEvent);
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {

          message.textContent = "A communication error occurred.";
        }
      }
      suspendInput = false;
    } // section 5

    else if (e.target.classList.contains("editButton")) {
      editPost.dataset.id = e.target.dataset.id;
      suspendInput = true;
      try {
        const response = await fetch(`/api/v1/posts/${e.target.dataset.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.status === 200) {
          title.value = data.post.title;
          body.value = data.post.body;
          status.value = data.post.status;
          showing.style.display = "none";
          showing = editPost;
          showing.style.display = "block";
          addingPost.textContent = "update";
          message.textContent = "";
        } else {
          // might happen if the list has been updated since last display
          message.textContent = "The post was not found";
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        }
      } catch (err) {
        message.textContent = "A communications error has occurred.";
      }
      suspendInput = false;
    } // section 6

    else if (e.target.classList.contains("deleteButton")) {
      suspendInput = true;
      try {
        const postID = e.target.dataset.id;
        const response = await fetch(`/api/v1/posts/${postID}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }, 
        });
        const data = await response.json();
        if (response.status === 200) {
          message.textContent = "The post was deleted.";
          showing.style.display = "none"; 
          thisEvent = new Event("startDisplay");
          document.dispatchEvent(thisEvent);
        } else {
          message.textContent = data.msg;
        }
      } catch (err) { 
        message.textContent = "A communication error occurred.";
      }
      suspendInput = false;
    }
  });   
});
