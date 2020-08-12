export function initDockerCompose(projectName: string, databases: any) {
    let dockerComposeContent = '';
    let dataBasesContent = ''
    const mongoDBService = '\n  mongodb:\n    container_name: mongodb\n    image: mongo\n    restart: always\n    environment:\n      MONGO_INITDB_ROOT_USERNAME: root\n      MONGO_INITDB_ROOT_PASSWORD: mongodb\n      MONGO_INITDB_DATABASE: test\n    ports:\n      - 27017:27017\n\n  mongo-express:\n    image: mongo-express\n    restart: always\n    ports:\n      - 8081:8081\n    environment:\n      ME_CONFIG_MONGODB_ADMINUSERNAME: root\n      ME_CONFIG_MONGODB_ADMINPASSWORD: mongodb\n'
    if(databases.indexOf('MongoDB') > -1) {
        dataBasesContent += mongoDBService;
    }
    dockerComposeContent = `# ============================================\n# PRODUCTION docker-compose configuration file\n# ============================================\n\nversion: \"3.1\"\n\nservices:\n${dataBasesContent}\n  api:\n    build: .\/\n    container_name: ${projectName}\n    ports:\n      - 3000:3000\n    links:\n      - mongodb`;
    return dockerComposeContent;
}