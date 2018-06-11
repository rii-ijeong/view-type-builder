package com.builder.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "viewDefinition")
public class ViewDefinition{
  private String id;
  private String jsonDefinition;
  private String name;

  public ViewDefinition(){

  }

  public ViewDefinition(String id, String name, String jsonDefinition){
    this.id = id;
    this.name = name;
    this.jsonDefinition = jsonDefinition;
  }

  @DynamoDBHashKey(attributeName = "id")
  public String getId(){
    return this.id;
  }

  @DynamoDBAttribute(attributeName = "name")
  public String getName(){
    return this.name;
  }

  @DynamoDBAttribute(attributeName = "jsonDefinition")
  public String getJsonDefinition(){
    return this.jsonDefinition;
  }

  public void setId(String id){
    this.id = id;
  }

  public void setName(String name){
    this.name = name;
  }

  public void setJsonDefinition(String jsonDefinition){
    this.jsonDefinition = jsonDefinition;
  }

  @Override
  public String toString() {
    return String.format("Type[id=%s, name=%s jsonDefinition='%s']", id, name, jsonDefinition);
  }
}