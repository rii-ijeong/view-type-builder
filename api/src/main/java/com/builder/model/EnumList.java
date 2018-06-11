package com.builder.model;

import java.util.List;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBAttribute;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBHashKey;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;

@DynamoDBTable(tableName = "enum")
public class EnumList{
  private String id;
  private String name;
  private List<String> values;

  public EnumList(){

  }

  public EnumList(String id, String name, List<String> values){
    this.id = id;
    this.name = name;
    this.values = values;
  }

  @DynamoDBHashKey(attributeName = "id")
  public String getId(){
    return this.id;
  }

  @DynamoDBAttribute(attributeName = "name")
  public String getName(){
    return this.name;
  }

  @DynamoDBAttribute(attributeName = "values")
  public List<String> getValues(){
    return this.values;
  }

  public void setId(String id){
    this.id = id;
  }

  public void setName(String name){
    this.name = name;
  }

  public void setValues(List<String> values){
    this.values = values;
  }

  @Override
  public String toString() {
    return String.format("Type[id=%s, name=%s]", id, name);
  }
}