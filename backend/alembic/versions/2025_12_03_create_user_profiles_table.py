"""create user profiles table

Revision ID: d11f71a4b5d2
Revises: 
Create Date: 2025-12-03 23:20:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd11f71a4b5d2'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'user_profiles',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.String, sa.ForeignKey('auth.users.id', ondelete='CASCADE'), unique=True, nullable=False),
        sa.Column('fitness_goal', sa.String, nullable=True),
        sa.Column('dietary_preferences', sa.ARRAY(sa.String), nullable=True), # Using ARRAY for simplicity
        sa.Column('fitness_persona', sa.String, nullable=True),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now(), nullable=False),
    )


def downgrade():
    op.drop_table('user_profiles')
