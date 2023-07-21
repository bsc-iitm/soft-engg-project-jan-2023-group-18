from application import db, mm
from datetime import datetime, timedelta

timestamp = (datetime.now() +
             timedelta(hours=5, minutes=30)).strftime("%Y-%m-%d %H:%M:%S")


class User(db.Model):
  __tablename__ = 'user'
  email = db.Column('email',
                    db.String(64),
                    nullable=False,
                    unique=True,
                    primary_key=True)
  password = db.Column('password', db.String(16), nullable=False)
  role = db.Column('role', db.Integer, nullable=False)
  status = db.Column('status', db.Integer, nullable=False, default=0)


class Ticket(db.Model):
  __tablename__ = 'ticket'
  id = db.Column('id',
                 db.Integer,
                 nullable=False,
                 unique=True,
                 primary_key=True,
                 autoincrement=True)
  user_email = db.Column('user_email',
                         db.String(64),
                         db.ForeignKey(User.email),
                         nullable=False)
  title = db.Column('title', db.String(256), nullable=False)
  tags = db.Column('tags', db.String(64), nullable=False)
  desc = db.Column('desc', db.String(1000), nullable=False)
  image = db.Column('image', db.String(1000000), nullable=True)
  status = db.Column('status', db.Integer, nullable=False, default=0)
  likes = db.Column('likes', db.Integer, nullable=False, default=0)
  is_faq = db.Column('is_faq', db.Integer, nullable=False, default=0)
  timestamp = db.Column('timestamp', nullable=False, default=timestamp)


class Content(db.Model):
  __tablename__ = 'content'
  id = db.Column('id',
                 db.Integer,
                 nullable=False,
                 unique=True,
                 primary_key=True,
                 autoincrement=True)
  user_email = db.Column('user_email',
                         db.String(64),
                         db.ForeignKey(User.email),
                         nullable=False)
  ticket_id = db.Column('ticket_id',
                        db.Integer,
                        db.ForeignKey(Ticket.id),
                        nullable=False)
  text = db.Column('text', db.String(1000), nullable=False)
  image = db.Column('image', db.String(1000000), nullable=True)
  timestamp = db.Column('timestamp', nullable=False, default=timestamp)


class Like(db.Model):
  __tablename__ = 'like'
  id = db.Column('id',
                 db.Integer,
                 nullable=False,
                 unique=True,
                 primary_key=True,
                 autoincrement=True)
  user_email = db.Column('user_email',
                         db.String(64),
                         db.ForeignKey(User.email),
                         nullable=False)
  ticket_id = db.Column('ticket_id',
                        db.Integer,
                        db.ForeignKey(Ticket.id),
                        nullable=False)


class UserSchema(mm.SQLAlchemyAutoSchema):

  class Meta:
    fields = ['email', 'role', 'status']


user_schema = UserSchema()
users_schema = UserSchema(many=True)


class TicketSchema(mm.SQLAlchemyAutoSchema):

  class Meta:
    fields = [
      'id', 'user_email', 'title', 'tags', 'desc', 'image', 'status', 'likes',
      'is_faq', 'timestamp'
    ]


ticket_schema = TicketSchema()
tickets_schema = TicketSchema(many=True)


class ContentSchema(mm.SQLAlchemyAutoSchema):

  class Meta:
    fields = ['id', 'ticket_id', 'user_email', 'text', 'image', 'timestamp']


content_schema = ContentSchema()
contents_schema = ContentSchema(many=True)


class LikeSchema(mm.SQLAlchemyAutoSchema):

  class Meta:
    fields = ['user_email', 'ticket_id']


like_schema = LikeSchema()
likes_schema = LikeSchema(many=True)
