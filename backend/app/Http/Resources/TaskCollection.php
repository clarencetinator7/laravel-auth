<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TaskCollection extends ResourceCollection
{
  /**
   * Transform the resource collection into an array.
   *
   * @return array<string, mixed>
   */
  public function toArray(Request $request): array
  {
    // return [
    //   'data' => $this->collection,
    // ];
    return parent::toArray($request);
  }
}