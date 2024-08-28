package com.brs.sun.api;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class NaverOcrApi {

	@Value("${naver.service.url}")
	private String url;

	public List<String> callOcrApi(String type, String filePath, String naverSecretKey, String ext){
		String apiURL = url;
		String secretKey = naverSecretKey;
		String imageFile = filePath;
		List<String> parseData = null;
		
		
		log.info("callOcrApi start " + "type: " + type + " file path: " + filePath + " ext: " + ext);
		
		try {
			URL url = new URL(apiURL);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setUseCaches(false);
			connection.setDoInput(true);
			connection.setDoOutput(true);
			connection.setReadTimeout(30000);
			connection.setRequestMethod(type);
			String boundary = "----" + UUID.randomUUID().toString().replace("-", "");
			connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
			connection.setRequestProperty("X-OCR-SECRET", secretKey);
			
			Gson gson = new Gson();
	        
	        JsonObject json = new JsonObject();
	        json.addProperty("version", "V2");
	        json.addProperty("requestId", UUID.randomUUID().toString());
	        json.addProperty("timestamp", System.currentTimeMillis());
	        
	        JsonObject image = new JsonObject();
	        image.addProperty("format", ext);
	        image.addProperty("name", "demo");
	        
	        JsonArray images = new JsonArray();
	        images.add(image);
	        
	        json.add("images", images);
	        
	        String postParams = gson.toJson(json);
            
            connection.connect();
            
            DataOutputStream wr = new DataOutputStream(connection.getOutputStream());
            File file = new File(imageFile);
            writeMultiPart(wr, postParams, file, boundary);
            wr.close();
            
            int responseCode = connection.getResponseCode();
            BufferedReader br;
            
            if(responseCode == 200) {
            	br = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            } else {
            	br = new BufferedReader(new InputStreamReader(connection.getErrorStream()));
            }
            
            String inputLine;
            StringBuffer response = new StringBuffer();
            
            while((inputLine = br.readLine()) != null) {
            	response.append(inputLine);
            }
            
            br.close();
            
            parseData = jsonparse(response);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return parseData;
	}

	private static void writeMultiPart(DataOutputStream out, String jsonMessage, File file, String boundary)
			throws IOException {
		StringBuilder sb = new StringBuilder();
		sb.append("--").append(boundary).append("\r\n");
		sb.append("Content-Disposition:form-data; name=\"message\"\r\n\r\n");
		sb.append(jsonMessage);
		sb.append("\r\n");

		out.write(sb.toString().getBytes("UTF-8"));
		out.flush();

		if (file != null && file.isFile()) {
			out.write(("--" + boundary + "\r\n").getBytes("UTF-8"));
			StringBuilder fileString = new StringBuilder();
			fileString.append("Content-Disposition:form-data; name=\"file\"; filename=");
			fileString.append("\"" + file.getName() + "\"\r\n");
			fileString.append("Content-Type: application/octet-stream\r\n\r\n");
			out.write(fileString.toString().getBytes("UTF-8"));
			out.flush();

			try (FileInputStream fis = new FileInputStream(file)) {
				byte[] buffer = new byte[8192];
				int count;
				while ((count = fis.read(buffer)) != -1) {
					out.write(buffer, 0, count);
				}
				out.write("\r\n".getBytes());
			}

			out.write(("--" + boundary + "--\r\n").getBytes("UTF-8"));
		}
		out.flush();
	}
	
	private static List<String> jsonparse(StringBuffer response) {
	    // Gson 객체 생성
	    Gson gson = new Gson();
	    
	    // JSON 문자열을 JsonObject로 변환
	    JsonObject jsonResponse = gson.fromJson(response.toString(), JsonObject.class);
	    
	    // "images" 배열 가져오기
	    JsonArray imagesArray = jsonResponse.getAsJsonArray("images");
	    JsonObject imageObject = imagesArray.get(0).getAsJsonObject();
	    
	    // "fields" 배열 가져오기
	    JsonArray fieldsArray = imageObject.getAsJsonArray("fields");
	    
	    // "fields" 배열에서 "inferText" 값 추출
	    List<String> result = new ArrayList<>();
	    for (JsonElement fieldElement : fieldsArray) {
	        JsonObject fieldObject = fieldElement.getAsJsonObject();
	        String inferText = fieldObject.get("inferText").getAsString();
	        result.add(inferText);
	    }

	    return result;
	}
}
