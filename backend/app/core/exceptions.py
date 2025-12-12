from fastapi import HTTPException, status

class SupabaseDatabaseError(HTTPException):
    def __init__(self, detail: str = "A database error occurred with Supabase.", status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        super().__init__(status_code=status_code, detail=detail)

