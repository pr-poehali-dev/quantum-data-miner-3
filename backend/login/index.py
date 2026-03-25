import json
import os
import hashlib
import psycopg2


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    """Вход пользователя по email и паролю. Возвращает данные профиля."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    raw_body = event.get('body', '{}')
    body = raw_body
    if isinstance(body, str):
        body = json.loads(body)
    if isinstance(body, str):
        body = json.loads(body)

    email = body.get('email', '').strip().lower()
    password = body.get('password', '').strip()

    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Введите email и пароль'})
        }

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute(
        f"SELECT id, first_name, last_name, city, country, photo_url FROM {schema}.users WHERE email = %s AND password_hash = %s",
        (email, hash_password(password))
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {
            'statusCode': 401,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный email или пароль'})
        }

    user = {
        'id': row[0],
        'first_name': row[1],
        'last_name': row[2],
        'city': row[3],
        'country': row[4],
        'photo_url': row[5],
        'email': email,
    }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'user': user})
    }
