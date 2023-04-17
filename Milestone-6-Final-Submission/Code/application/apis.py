from application import db, app
from application.models import *
from flask import jsonify, make_response, request, render_template, redirect, session
from flask_restful import Resource
from werkzeug.exceptions import HTTPException
import json


class UserAPI(Resource):

  def get(self, email=None):
    if email == None:
      if session['email'] == None or session['role'] in [0, 1] or session['status'] in [-1, 0]:
        return make_response({}, 401)
      else:
        query = User.query.all()
        serialized_query = users_schema.dump(query)
        return jsonify(serialized_query)
    else:
      if session['email'] == email or (session['email'] != None and session['status'] in [1]):
        query = User.query.filter_by(email=email).first()
        return user_schema.jsonify(query)
      else:
        return make_response({}, 401)

  def post(self):
    if User.query.filter_by(email=request.json['email']).first() == None:
      query = User(email=request.json['email'],
                   password=request.json['password'],
                   role=request.json['role'])
      db.session.add(query)
      db.session.commit()
      return user_schema.jsonify(query)
    else:
      return make_response({}, 400)

  def put(self, email):
    if session['email'] == None:
      return make_response({}, 401)
    else:
      query = User.query.filter_by(email=email).first()
      if query == None:
        return make_response({}, 404)
      else:
        if 'password' in request.json:
          if session['email'] == query.email:
            query.password = request.json['password']
          else:
            return make_response({}, 401)
        if 'role' in request.json:
          if session['email'] == query.email:
            query.role = request.json['role']
            query.status = 0
          elif session['role'] in [2] and session['status'] in [1]:
            query.role = request.json['role']
            query.status = 1
          else:
            return make_response({}, 401)
        if 'status' in request.json:
          if session['role'] in [2] and session['status'] in [1]:
            query.status = request.json['status']
          else:
            return make_response({}, 401)
        db.session.commit()
        return user_schema.jsonify(query)

  def delete(self, email):
    if session['email'] == None:
      return make_response({}, 401)
    else:
      query = User.query.filter_by(email=email).first()
      if query == None:
        return make_response({}, 404)
      else:
        if session['email'] == query.email or (session['role'] in [2] and session['status'] in [1]):
          db.session.delete(query)
        else:
          return make_response({}, 401)
        db.session.commit()
        return user_schema.jsonify(query)


class TicketAPI(Resource):

  def get(self, id=None):
    if session['email'] == None or session['status'] in [-1, 0]:
      return make_response({}, 401)
    else:
      if id == None:
        # if 'email' in request.json:
        #   query = Ticket.query.filter_by(
        #     user_email=request.json['email']).all()
        #   serialized_query = tickets_schema.dump(query)
        #   return jsonify(serialized_query)
        # else:
        query = Ticket.query.all()
        serialized_query = tickets_schema.dump(query)
        return jsonify(serialized_query)
      else:
        query = Ticket.query.filter_by(id=id).first()
        return ticket_schema.jsonify(query)

  def post(self):
    if session['email'] == None or session['status'] in [-1, 0]:
      return make_response({}, 401)
    else:
      image = request.json['image'] if 'image' in request.json else str()
      query = Ticket(user_email=session['email'],
                     title=request.json['title'],
                     tags=request.json['tags'],
                     desc=request.json['desc'],
                     image=image)
      db.session.add(query)
      db.session.commit()
      return ticket_schema.jsonify(query)

  def put(self, id):
    if session['email'] == None or session['status'] in [-1, 0]:
      return make_response({}, 401)
    else:
      query = Ticket.query.filter_by(id=id).first()
      if query == None:
        return make_response({}, 404)
      else:
        if 'title' in request.json:
          if session['email'] == query.user_email:
            query.title = request.json['title']
          else:
            return make_response({}, 401)
        if 'tags' in request.json:
          if session['email'] == query.user_email:
            query.tags = request.json['tags']
          else:
            return make_response({}, 401)
        if 'desc' in request.json:
          if session['email'] == query.user_email:
            query.desc = request.json['desc']
          else:
            return make_response({}, 401)
        if 'image' in request.json:
          if session['email'] == query.user_email:
            query.image = request.json['image']
          else:
            return make_response({}, 401)
        if 'status' in request.json:
          if session['role'] in [1, 2]:
            query.status = request.json['status']
          else:
            return make_response({}, 401)
        if 'is_faq' in request.json:
          if session['role'] in [2]:
            query.is_faq = request.json['is_faq']
          else:
            return make_response({}, 401)
        db.session.commit()
        return ticket_schema.jsonify(query)

  def delete(self, id):
    if session['email'] == None or session['status'] in [-1, 0]:
      return make_response({}, 401)
    else:
      query = Ticket.query.filter_by(id=id).first()
      if query == None:
        return make_response({}, 404)
      else:
        if session['email'] == query.user_email or session['role'] in [2]:
          db.session.delete(query)
          # q0 = Content.query.filter_by(ticket_id=id).all()
          # if q0 != None:
          #   db.session.delete(q0)
          # q1 = Like.query.filter_by(ticket_id=id).all()
          # if q1 != None:
          #   db.session.delete(q1)
        else:
          return make_response({}, 401)
        db.session.commit()
        return ticket_schema.jsonify(query)


class ContentAPI(Resource):

  def get(self, id, i=None):
    if session['email'] == None or session['status'] in [-1, 0]:
      return make_response({}, 401)
    else:
      if i == None:
        # if 'email' in request.json:
        #   query = Content.query.filter_by(
        #     ticket_id=id, user_email=request.json['email']).all()
        #   serialized_query = contents_schema.dump(query)
        #   return jsonify(serialized_query)
        # else:
        query = Content.query.filter_by(ticket_id=id).all()
        serialized_query = contents_schema.dump(query)
        return jsonify(serialized_query)
      else:
        query = Content.query.filter_by(id=i).first()
        return content_schema.jsonify(query)

  def post(self, id):
    if session['email'] == None or session['status'] in [-1, 0]:
      return make_response({}, 401)
    else:
      if Ticket.query.filter_by(id=id).first() == None:
        return make_response({}, 404)
      else:
        image = request.json['image'] if 'image' in request.json else str()
        query = Content(ticket_id=id,
                        user_email=session['email'],
                        text=request.json['text'],
                        image=image)
        db.session.add(query)
        db.session.commit()
        return content_schema.jsonify(query)

  def put(self, id, i):
    if session['email'] == None or session['status'] in [-1, 0]:
      return make_response({}, 401)
    else:
      query = Content.query.filter_by(id=i).first()
      if query == None:
        return make_response({}, 404)
      else:
        if 'text' in request.json:
          if session['email'] == query.user_email:
            query.text = request.json['text']
          else:
            return make_response({}, 401)
        if 'image' in request.json:
          if session['email'] == query.user_email:
            query.image = request.json['image']
          else:
            return make_response({}, 401)
        db.session.commit()
        return content_schema.jsonify(query)

  def delete(self, id, i):
    if session['email'] == None or session['status'] in [-1, 0]:
      return make_response({}, 401)
    else:
      query = Content.query.filter_by(id=i, ticket_id=id).first()
      if query == None:
        return make_response({}, 404)
      else:
        if session['email'] == query.user_email or session['role'] in [2]:
          db.session.delete(query)
        else:
          return make_response({}, 401)
        db.session.commit()
        return content_schema.jsonify(query)


class LikeAPI(Resource):

  def get(self, id=None):
    if session['email'] == None or session['status'] in [-1, 0]:
      return make_response({}, 401)
    else:
      if id == None:
        query = Like.query.filter_by(user_email=session['email']).all()
        serialized_query = likes_schema.dump(query)
        d = dict()
        d[session['email']] = list()
        for q in list(serialized_query):
          d[session['email']].append(q['ticket_id'])
        return make_response(d)
      else:
        query = Like.query.filter_by(ticket_id=id).all()
        serialized_query = likes_schema.dump(query)
        d = dict()
        d[id] = list()
        for q in list(serialized_query):
          d[id].append(q['user_email'])
        return make_response(d)

  def post(self, id):
    if session['email'] == None or session['status'] in [-1, 0]:
      return make_response({}, 401)
    else:
      if Like.query.filter_by(ticket_id=id, user_email=session['email']).first(
      ) == None and Ticket.query.filter_by(id=id).first() != None:
        query = Like(ticket_id=id, user_email=session['email'])
        db.session.add(query)
        query_ = Ticket.query.filter_by(id=id).first()
        query_.likes += 1
        db.session.commit()
        return like_schema.jsonify(query)
      else:
        return make_response({}, 404)

  def delete(self, id):
    if session['email'] == None or session['status'] in [-1, 0]:
      return make_response({}, 401)
    else:
      query = Like.query.filter_by(ticket_id=id, user_email=session['email']).first()
      if query == None:
        return make_response({}, 404)
      else:
        if session['email'] == query.user_email:
          db.session.delete(query)
          query_ = Ticket.query.filter_by(id=id).first()
          query_.likes -= 1
        else:
          return make_response({}, 401)
        db.session.commit()
        return like_schema.jsonify(query)


class HomeAPI(Resource):

  def get(self):
    # session['email'] = None
    # session['role'] = None
    # session['status'] = None
    return make_response(render_template('index.html'), 200)

  def post(self):
    if 'role' in request.json:
      response = UserAPI().post()
      if response.status_code == 400:
        return make_response({}, 400)
      elif response.status_code == 200:
        session['email'] = response.json['email']
        session['role'] = response.json['role']
        session['status'] = response.json['status']
        return make_response({}, 200)
    else:
      response = User.query.filter_by(email=request.json['email']).first()
      if response == None:
        return make_response({}, 404)
      else:
        if response.password == request.json['password']:
          session['email'] = response.email
          session['role'] = response.role
          session['status'] = response.status
          return make_response({}, 200)
        else:
          return make_response({}, 400)


@app.route('/logout')
def logout():
  session['email'] = None
  session['role'] = None
  session['status'] = None
  return redirect('/')


@app.route('/current')
def current():
  c = {
    'email': session['email'],
    'role': session['role'],
    'status': session['status']
  }
  return json.dumps(c)


@app.errorhandler(HTTPException)
def handle_exception(e):
  response = e.get_response()
  response.data = json.dumps({
    "code": e.code,
    "name": e.name,
    "description": e.description,
  })
  response.content_type = "application/json"
  return make_response(response)
