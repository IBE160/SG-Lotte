from sqlalchemy import Column, Integer, Date, String, ForeignKey
from sqlalchemy.orm import relationship
from .__init__ import Base
from datetime import date

class MealLog(Base):
    __tablename__ = "meal_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    meal_date = Column(Date, default=date.today, nullable=False)
    meal_type = Column(String, nullable=False)
    calories_consumed = Column(Integer, nullable=False)

    owner = relationship("User", back_populates="meal_logs")
