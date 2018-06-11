package com.builder.controller;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.web.client.RestTemplate;

import com.builder.model.ViewDefinition;
import com.builder.repo.ViewDefinitionRepository;

@RestController
@RequestMapping("/api/view-definition")
public class ViewDefinitionController {

  @Autowired
  ViewDefinitionRepository repository;

  @CrossOrigin(origins="http://localhost:3006")
  @RequestMapping(
    value = "/save",
    method = RequestMethod.POST
  )
  public ResponseEntity<?> addViewDefinition(
    @RequestBody ViewDefinition viewDefinition
  ){
    ViewDefinition existingViewDefinition = repository.findOne(viewDefinition.getId());
    if(existingViewDefinition != null){
      return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    repository.save(viewDefinition);
    return new ResponseEntity<>(viewDefinition, HttpStatus.OK);
  }

  @CrossOrigin(origins="http://localhost:3006")
  @RequestMapping(
    value = "/get",
    method = RequestMethod.GET
  )
  public ResponseEntity<?> getViewDefinition(
    @RequestParam("id") String id
  ){
    ViewDefinition existingViewDefinition = repository.findOne(id);
    if(existingViewDefinition == null){
      return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    return new ResponseEntity<>(existingViewDefinition, HttpStatus.OK);
  }

  @CrossOrigin(origins="http://localhost:3006")
  @RequestMapping(
    value = "/delete",
    method = RequestMethod.GET
  )
  public ResponseEntity<?> deleteViewDefinition(
    @RequestParam("id") String id
  ){
    ViewDefinition existingViewDefinition = repository.findOne(id);
    if(existingViewDefinition == null){
      return new ResponseEntity<>(HttpStatus.CONFLICT);
    }

    repository.delete(existingViewDefinition);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  @CrossOrigin(origins="http://localhost:3006")
  @RequestMapping(
    value = "/get-all",
    method = RequestMethod.GET
  )
  public List<ViewDefinition> getAll(){
    Iterable<ViewDefinition> viewDefinitions = repository.findAll();
    List<ViewDefinition> viewList = new ArrayList<ViewDefinition>();
    for(ViewDefinition viewDefinition : viewDefinitions ){
      viewList.add(viewDefinition);
    }
    return viewList;
  }
}