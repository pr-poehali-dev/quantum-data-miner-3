import json
import os
import base64
import hashlib
import boto3
import psycopg2
from datetime import datetime


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    """Регистрация нового пользователя. Сохраняет данные профиля в БД, фото — в S3."""

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

    first_name = body.get('first_name', '').strip()
    last_name = body.get('last_name', '').strip()
    age = body.get('age')
    city = body.get('city', '').strip()
    country = body.get('country', '').strip()
    email = body.get('email', '').strip().lower()
    password = body.get('password', '').strip()
    hobbies = body.get('hobbies', '').strip() or None
    photo_base64 = body.get('photo_base64')

    if not all([first_name, last_name, age, city, country, email, password]):
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Заполните все обязательные поля'})
        }

    photo_url = None
    if photo_base64:
        header, data = photo_base64.split(',', 1) if ',' in photo_base64 else ('', photo_base64)
        ext = 'jpg'
        if 'png' in header:
            ext = 'png'
        elif 'webp' in header:
            ext = 'webp'

        image_data = base64.b64decode(data)
        filename = f"avatars/{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}.{ext}"

        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        s3.put_object(Bucket='files', Key=filename, Body=image_data, ContentType=f'image/{ext}')
        photo_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{filename}"

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(f"SELECT id FROM {schema}.users WHERE email = %s", (email,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return {
            'statusCode': 409,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Пользователь с таким email уже существует'})
        }

    cur.execute(
        f"""INSERT INTO {schema}.users (first_name, last_name, age, city, country, hobbies, photo_url, email, password_hash)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
        (first_name, last_name, int(age), city, country, hobbies, photo_url, email, hash_password(password))
    )
    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 201,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'user_id': user_id})
    }
