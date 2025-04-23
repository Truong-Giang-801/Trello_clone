import { ListModel } from "../models/ListModel.js";
import ListService from "../services/ListService.js";

const listService = new ListService();

// GET /:listId → Lấy list theo Id
export async function getListById(req, res) {
    try {
      const { listId } = req.params;
      const list = await listService.getListById(listId);
      res.status(200).json(list);
    } catch (error) {
      console.error("Error getting list:", error);
      res.status(500).send("Internal server error");
    }
  }

export async function createList(req, res) {
  try {
    const list = new ListModel(req.body);
    const createdList = await listService.createList(list);
    res.status(201).json(createdList);
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).send("Internal server error");
  }
}

// GET /:listId → Lấy list theo Board 
export async function getAllListByBoard(req, res) {
  try {
    const { boardId } = req.params;
    const lists = await listService.getAllListByList(boardId);
    res.status(200).json(lists);
  } catch (error) {
    console.error("Error getting list:", error);
    res.status(500).send("Internal server error");
  }
}

export async function deleteList(req, res) {
  try {
    const { listId } = req.params;
    const deleted = await listService.deleteList(listId);
    res.status(200).json(deleted);
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).send("Internal server error");
  }
}

// PUT /lists/:listId
export async function editList(req, res) {
  try {
    const { listId } = req.params;
    const updated = await listService.editList(listId, req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error editing list:", error);
    res.status(500).send("Internal server error");
  }
}
