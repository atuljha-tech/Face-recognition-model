from sqlalchemy import create_engine, Column, Integer, String, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine("sqlite:///faces.db")
Session = sessionmaker(bind=engine)
Base = declarative_base()

class Face(Base):
    __tablename__ = "faces"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    encoding = Column(LargeBinary)

Base.metadata.create_all(engine)
print("✅ Database ready at faces.db")