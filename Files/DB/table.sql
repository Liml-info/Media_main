-- 创建用户表
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建任务表
CREATE TABLE tasks (
    task_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    task_type VARCHAR(30) NOT NULL CHECK (task_type IN ('text_to_video', 'image_to_video', 'image_generation', 'virtual_try_on')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('submitted', 'processing','succeed', 'failed')) DEFAULT'submitted',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建文生视频请求参数表
CREATE TABLE text_to_video_requests (
    request_id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES tasks(task_id),
    model_name VARCHAR(50) NOT NULL,
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    cfg_scale FLOAT DEFAULT 0.5,
    mode VARCHAR(10) NOT NULL CHECK (mode IN ('std', 'pro')) DEFAULT'std',
    aspect_ratio VARCHAR(10) NOT NULL CHECK (aspect_ratio IN ('16:9', '9:16', '1:1')) DEFAULT '16:9',
    duration VARCHAR(10) NOT NULL CHECK (duration IN ('5', '10')) DEFAULT '5',
    external_task_id VARCHAR(50)
);

-- 创建文生视频结果表
CREATE TABLE text_to_video_results (
    result_id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES tasks(task_id),
    video_url VARCHAR(255),
    video_duration INT
);

-- 创建图生视频请求参数表
CREATE TABLE image_to_video_requests (
    request_id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES tasks(task_id),
    model_name VARCHAR(50) NOT NULL,
    image TEXT NOT NULL,
    image_tail TEXT,
    prompt TEXT,
    negative_prompt TEXT,
    cfg_scale FLOAT DEFAULT 0.5,
    mode VARCHAR(10) NOT NULL CHECK (mode IN ('std', 'pro')) DEFAULT'std',
    static_mask TEXT,
    dynamic_masks JSONB,
    camera_control JSONB,
    aspect_ratio VARCHAR(10) NOT NULL CHECK (aspect_ratio IN ('16:9', '9:16', '1:1')) DEFAULT '16:9',
    duration VARCHAR(10) NOT NULL CHECK (duration IN ('5', '10')) DEFAULT '5',
    external_task_id VARCHAR(50)
);

-- 创建图生视频结果表
CREATE TABLE image_to_video_results (
    result_id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES tasks(task_id),
    video_url VARCHAR(255),
    video_duration INT
);

-- 创建图像生成请求参数表
CREATE TABLE image_generation_requests (
    request_id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES tasks(task_id),
    model_name VARCHAR(50) NOT NULL,
    prompt TEXT NOT NULL,
    negative_prompt TEXT,
    image TEXT,
    image_reference VARCHAR(20) CHECK (image_reference IN ('subject', 'face')),
    image_fidelity FLOAT DEFAULT 0.5,
    human_fidelity FLOAT DEFAULT 0.45,
    n INT NOT NULL CHECK (n BETWEEN 1 AND 9) DEFAULT 1,
    aspect_ratio VARCHAR(10) NOT NULL CHECK (aspect_ratio IN ('16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3', '21:9')) DEFAULT '16:9',
);

-- 创建图像生成结果表
CREATE TABLE image_generation_results (
    result_id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES tasks(task_id),
    image_urls TEXT[]
);

-- 创建虚拟试穿请求参数表
CREATE TABLE virtual_try_on_requests (
    request_id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES tasks(task_id),
    model_name VARCHAR(50) NOT NULL,
    human_image TEXT NOT NULL,
    cloth_image TEXT NOT NULL,
);

-- 创建虚拟试穿结果表
CREATE TABLE virtual_try_on_results (
    result_id SERIAL PRIMARY KEY,
    task_id INT NOT NULL REFERENCES tasks(task_id),
    image_url VARCHAR(255)
);