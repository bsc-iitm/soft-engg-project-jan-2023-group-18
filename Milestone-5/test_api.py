import requests

root = 'https://SE-Project.ansh-kushwaha.repl.co'


def admin_login():
  data = {'email': 'admin@web.app', 'password': 'P@&&w0rd'}
  requests.post(root + '/', json=data)


def support_login():
  data = {'email': 'support@web.app', 'password': 'P@&&w0rd'}
  requests.post(root + '/', json=data)


def student_login():
  data = {'email': 'student@web.app', 'password': 'P@&&w0rd'}
  requests.post(root + '/', json=data)


def user_login():
  data = {'email': 'user@web.app', 'password': 'P@&&w0rd'}
  requests.post(root + '/', json=data)


def logout():
  requests.get(root + '/')


class TestHomeAPI():

  def test_home_get(self):
    response = requests.get(root + '/')
    assert response.status_code == 200

  def test_home_post_register_200(self):
    data = {'email': 'user@web.app', 'password': 'P@&&w0rd', 'role': 2}
    response = requests.post(root + '/', json=data)
    assert response.status_code == 200

  def test_home_post_register_400(self):
    data = {'email': 'user@web.app', 'password': 'P@&&w0rd', 'role': 2}
    response = requests.post(root + '/', json=data)
    assert response.status_code == 400

  def test_home_post_login_200(self):
    data = {'email': 'user@web.app', 'password': 'P@&&w0rd'}
    response = requests.post(root + '/', json=data)
    assert response.status_code == 200

  def test_home_post_login_400(self):
    data = {'email': 'user@web.app', 'password': 'P@ssw0rd'}
    response = requests.post(root + '/', json=data)
    assert response.status_code == 400

  def test_home_post_login_404(self):
    data = {'email': 'users@web.app', 'password': 'P@&&w0rd'}
    response = requests.post(root + '/', json=data)
    assert response.status_code == 404


class TestUserAPI():

  def test_user_get_all_200(self):
    admin_login()
    response = requests.get(root + '/user')
    assert response.status_code == 200
    assert response.json() == [{
      'email': 'admin@web.app',
      'role': 2,
      'status': 1
    }, {
      'email': 'support@web.app',
      'role': 1,
      'status': 1
    }, {
      'email': 'student@web.app',
      'role': 0,
      'status': 1
    }, {
      'email': 'user@web.app',
      'role': 2,
      'status': 0
    }]

  def test_user_get_one_200(self):
    admin_login()
    response = requests.get(root + '/user/user@web.app')
    assert response.status_code == 200
    assert response.json() == {'email': 'user@web.app', 'role': 2, 'status': 0}

  def test_user_get_all_401(self):
    logout()
    response = requests.get(root + '/user')
    assert response.status_code == 401

  def test_user_get_one_401(self):
    logout()
    response = requests.get(root + '/user/user@web.app')
    assert response.status_code == 401

  def test_user_post_200(self):
    data = {'email': 'user0@web.app', 'password': 'P@&&w0rd', 'role': 2}
    response = requests.post(root + '/user', json=data)
    assert response.status_code == 200
    assert response.json() == {
      'email': 'user0@web.app',
      'role': 2,
      'status': 0
    }

  def test_user_post_400(self):
    data = {'email': 'user0@web.app', 'password': 'P@&&w0rd', 'role': 2}
    response = requests.post(root + '/user', json=data)
    assert response.status_code == 400

  def test_user_put_401(self):
    logout()
    response = requests.put(root + '/user/user@web.app')
    assert response.status_code == 401

  def test_user_put_404(self):
    admin_login()
    response = requests.put(root + '/user/users@web.app')
    assert response.status_code == 404

  def test_user_put_password_200(self):
    user_login()
    data = {'password': 'P@&&w0rd'}
    response = requests.put(root + '/user/user@web.app', json=data)
    assert response.status_code == 200
    assert response.json() == {'email': 'user@web.app', 'role': 2, 'status': 0}

  def test_user_put_role_user_200(self):
    user_login()
    data = {'role': 1}
    response = requests.put(root + '/user/user@web.app', json=data)
    assert response.status_code == 200
    assert response.json() == {'email': 'user@web.app', 'role': 1, 'status': 0}

  def test_user_put_role_admin_200(self):
    admin_login()
    data = {'role': 2}
    response = requests.put(root + '/user/user@web.app', json=data)
    assert response.status_code == 200
    assert response.json() == {'email': 'user@web.app', 'role': 2, 'status': 0}

  def test_user_put_status_200(self):
    admin_login()
    data = {'status': 1}
    response = requests.put(root + '/user/user@web.app', json=data)
    assert response.status_code == 200
    assert response.json() == {'email': 'user@web.app', 'role': 2, 'status': 1}

  def test_user_put_password_401(self):
    admin_login()
    data = {'password': 'P@&&w0rd'}
    response = requests.put(root + '/user/user@web.app', json=data)
    assert response.status_code == 401

  def test_user_put_role_401(self):
    support_login()
    data = {'role': 2}
    response = requests.put(root + '/user/user@web.app', json=data)
    assert response.status_code == 401

  def test_user_put_status_401(self):
    student_login()
    data = {'status': 1}
    response = requests.put(root + '/user/user@web.app', json=data)
    assert response.status_code == 401

  def test_user_delete_401(self):
    logout()
    response = requests.delete(root + '/user/user@web.app')
    assert response.status_code == 401

  def test_user_delete_404(self):
    user_login()
    response = requests.delete(root + '/user/users@web.app')
    assert response.status_code == 404

  def test_user_delete_user_200(self):
    user_login()
    response = requests.delete(root + '/user/user@web.app')
    assert response.status_code == 200
    assert response.json() == {'email': 'user@web.app', 'role': 2, 'status': 1}

  def test_user_delete_admin_200(self):
    admin_login()
    response = requests.delete(root + '/user/user0@web.app')
    assert response.status_code == 200
    assert response.json() == {
      'email': 'user0@web.app',
      'role': 2,
      'status': 0
    }

  def test_user_delete_user_401(self):
    support_login()
    response = requests.delete(root + '/user/student@web.app')
    assert response.status_code == 401


class TestTicketAPI():

  def test_ticket_post_401(self):
    logout()
    response = requests.post(root + '/ticket')
    assert response.status_code == 401

  def test_ticket_post_200(self):
    student_login()
    data = {'title': 'Title', 'tags': 'Tags', 'desc': 'Desc'}
    requests.post(root + '/ticket', json=data)
    requests.post(root + '/ticket', json=data)
    response = requests.post(root + '/ticket', json=data)
    assert response.status_code == 200

  def test_ticket_get_all_401(self):
    logout()
    response = requests.get(root + '/ticket')
    assert response.status_code == 401

  def test_ticket_get_one_401(self):
    logout()
    response = requests.get(root + '/ticket/1')
    assert response.status_code == 401

  def test_ticket_get_all_200(self):
    student_login()
    data = {}
    response = requests.get(root + '/ticket', json=data)
    assert response.status_code == 200

  def test_ticket_get_all_user_200(self):
    student_login()
    data = {'email': 'student@web.app'}
    response = requests.get(root + '/ticket', json=data)
    assert response.status_code == 200

  def test_ticket_get_one_200(self):
    student_login()
    response = requests.get(root + '/ticket/1')
    assert response.status_code == 200

  def test_ticket_put_401(self):
    logout()
    response = requests.put(root + '/ticket/2')
    assert response.status_code == 401

  def test_ticket_put_404(self):
    student_login()
    response = requests.put(root + '/ticket/4')
    assert response.status_code == 404

  def test_ticket_put_title_200(self):
    student_login()
    data = {'title': 'title'}
    response = requests.put(root + '/ticket/2', json=data)
    assert response.status_code == 200

  def test_ticket_put_tags_200(self):
    student_login()
    data = {'tags': 'tags'}
    response = requests.put(root + '/ticket/2', json=data)
    assert response.status_code == 200

  def test_ticket_put_desc_200(self):
    student_login()
    data = {'desc': 'desc'}
    response = requests.put(root + '/ticket/2', json=data)
    assert response.status_code == 200

  def test_ticket_put_image_200(self):
    student_login()
    data = {'image': ''}
    response = requests.put(root + '/ticket/2', json=data)
    assert response.status_code == 200

  def test_ticket_put_status_200(self):
    support_login()
    data = {'status': 1}
    response = requests.put(root + '/ticket/2', json=data)
    assert response.status_code == 200

  def test_ticket_put_is_faq_200(self):
    admin_login()
    data = {'is_faq': 1}
    response = requests.put(root + '/ticket/2', json=data)
    assert response.status_code == 200

  def test_ticket_put_title_401(self):
    support_login()
    data = {'title': 'title'}
    response = requests.put(root + '/ticket/2', json=data)
    assert response.status_code == 401

  def test_ticket_put_tags_401(self):
    support_login()
    data = {'tags': 'tags'}
    response = requests.put(root + '/ticket/2', json=data)
    assert response.status_code == 401

  def test_ticket_put_desc_401(self):
    support_login()
    data = {'desc': 'desc'}
    response = requests.put(root + '/ticket/2', json=data)
    assert response.status_code == 401

  def test_ticket_put_image_401(self):
    support_login()
    data = {'image': ''}
    response = requests.put(root + '/ticket/2', json=data)
    assert response.status_code == 401

  def test_ticket_put_status_401(self):
    student_login()
    data = {'status': 1}
    response = requests.put(root + '/ticket/2', json=data)
    assert response.status_code == 401

  def test_ticket_put_is_faq_401(self):
    support_login()
    data = {'is_faq': 1}
    response = requests.put(root + '/ticket/2', json=data)
    assert response.status_code == 401

  def test_ticket_delete_401(self):
    logout()
    response = requests.delete(root + '/ticket/2')
    assert response.status_code == 401

  def test_ticket_delete_404(self):
    student_login()
    response = requests.delete(root + '/ticket/4')
    assert response.status_code == 404

  def test_ticket_delete_user_200(self):
    student_login()
    response = requests.delete(root + '/ticket/2')
    assert response.status_code == 200

  def test_ticket_delete_admin_200(self):
    admin_login()
    response = requests.delete(root + '/ticket/3')
    assert response.status_code == 200

  def test_ticket_delete_ticket_401(self):
    support_login()
    response = requests.delete(root + '/ticket/1')
    assert response.status_code == 401


class TestContentAPI():

  def test_content_post_401(self):
    logout()
    response = requests.post(root + '/ticket/1/content')
    assert response.status_code == 401

  def test_content_post_404(self):
    student_login()
    response = requests.post(root + '/ticket/2/content')
    assert response.status_code == 404

  def test_content_post_200(self):
    student_login()
    data = {'text': 'Text'}
    requests.post(root + '/ticket/1/content', json=data)
    requests.post(root + '/ticket/1/content', json=data)
    response = requests.post(root + '/ticket/1/content', json=data)
    assert response.status_code == 200

  def test_content_get_all_401(self):
    logout()
    response = requests.get(root + '/ticket/1/content')
    assert response.status_code == 401

  def test_content_get_one_401(self):
    logout()
    response = requests.get(root + '/ticket/1/content/1')
    assert response.status_code == 401

  def test_content_get_all_200(self):
    student_login()
    data = {}
    response = requests.get(root + '/ticket/1/content', json=data)
    assert response.status_code == 200

  def test_content_get_all_user_200(self):
    student_login()
    data = {'email': 'student@web.app'}
    response = requests.get(root + '/ticket/1/content', json=data)
    assert response.status_code == 200

  def test_content_get_one_200(self):
    student_login()
    response = requests.get(root + '/ticket/1/content/1')
    assert response.status_code == 200

  def test_content_put_401(self):
    logout()
    response = requests.put(root + '/ticket/1/content/1')
    assert response.status_code == 401

  def test_content_put_404(self):
    student_login()
    response = requests.put(root + '/ticket/1/content/4')
    assert response.status_code == 404

  def test_content_put_text_401(self):
    support_login()
    data = {'text': 'text'}
    response = requests.put(root + '/ticket/1/content/2', json=data)
    assert response.status_code == 401

  def test_content_put_image_401(self):
    support_login()
    data = {'image': ''}
    response = requests.put(root + '/ticket/1/content/2', json=data)
    assert response.status_code == 401

  def test_content_put_text_200(self):
    student_login()
    data = {'text': 'text'}
    response = requests.put(root + '/ticket/1/content/2', json=data)
    assert response.status_code == 200

  def test_content_put_image_200(self):
    student_login()
    data = {'image': ''}
    response = requests.put(root + '/ticket/1/content/2', json=data)
    assert response.status_code == 200

  def test_content_delete_401(self):
    logout()
    response = requests.delete(root + '/ticket/1/content/2')
    assert response.status_code == 401

  def test_content_delete_404(self):
    student_login()
    response = requests.delete(root + '/ticket/1/content/4')
    assert response.status_code == 404

  def test_content_delete_user_200(self):
    student_login()
    response = requests.delete(root + '/ticket/1/content/2')
    assert response.status_code == 200

  def test_content_delete_admin_200(self):
    admin_login()
    response = requests.delete(root + '/ticket/1/content/3')
    assert response.status_code == 200

  def test_content_delete_ticket_401(self):
    support_login()
    response = requests.delete(root + '/ticket/1/content/1')
    assert response.status_code == 401


class TestLikeAPI():

  def test_like_post_401(self):
    logout()
    response = requests.post(root + '/ticket/1/like')
    assert response.status_code == 401

  def test_like_post_404(self):
    student_login()
    response = requests.post(root + '/ticket/2/like')
    assert response.status_code == 404

  def test_like_post_200(self):
    student_login()
    response = requests.post(root + '/ticket/1/like')
    assert response.status_code == 200

  def test_like_get_all_401(self):
    logout()
    response = requests.get(root + '/like')
    assert response.status_code == 401

  def test_like_get_all_ticket_401(self):
    logout()
    response = requests.get(root + '/ticket/1/like')
    assert response.status_code == 401

  def test_like_get_all_200(self):
    student_login()
    response = requests.get(root + '/like')
    assert response.status_code == 200

  def test_like_get_all_ticket_200(self):
    student_login()
    response = requests.get(root + '/ticket/1/like')
    assert response.status_code == 200

  def test_like_delete_401(self):
    logout()
    response = requests.delete(root + '/ticket/1/like')
    assert response.status_code == 401

  def test_like_delete_404(self):
    student_login()
    response = requests.delete(root + '/ticket/2/like')
    assert response.status_code == 404

  def test_like_delete_200(self):
    student_login()
    response = requests.delete(root + '/ticket/1/like')
    assert response.status_code == 200


class TestConsistent():

  def test_maintain_database_consistency(self):
    admin_login()
    requests.delete(root + '/ticket/1/content/1')
    requests.delete(root + '/ticket/1')
    logout()
    assert True
